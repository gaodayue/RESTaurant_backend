var express = require('express'),
    router = express.Router(),
    iz = require('iz'),
    are = iz.are,
    validators = iz.validators,
    validationRules = require('../utils/validation_rules'),
    util = require('../utils/util'),
    db = require('../utils/database'),
    connection = db.connection(),
    async = require('async'),
    passport = require('passport'),
    _ = require('underscore'),
    BaiduPush = require('baidupush'),
    config = require('../config'),
    uuid = require('node-uuid');

var InvitationDAO = require('../model/Invitation');


router.get('/', passport.authenticate('bearer', { session: false }), function (req, res) {
  var custId = req.user.cust_id;
  var onlySent = (req.param('only_sent') ? true : false);
  var onlyRcv = (req.param('only_received') ? true : false);

  if (onlySent && onlyRcv)
    return res.json(400, 'cannot set both only_sent and only_received!');

  var sql = 'SELECT inv_id FROM invitations WHERE inv_cust_id = ?';
  if (onlySent)
    sql += ' and inv_is_host = "true"';
  if (onlyRcv)
    sql += ' and inv_is_host = "false"';
  sql += ' ORDER BY inv_created_time desc';

  connection.query(sql, custId, function (err, results) {
    if (err) throw err;
    if (results.length == 0)
      return res.json(200, []);

    // get detail for each invitaions
    var tasks = [];
    _.each(results, function (res) {
      tasks.push(function (callback) {
        InvitationDAO.getInvitationById(res.inv_id, function (err, invitation) {
          if (err) return callback(err);
          delete invitation.order.dishes;
          callback(null, invitation);
        });
      });
    });

    async.series(tasks, function (err, results) {
      if (err) res.json(500, util.showError(err));
      res.json(200, results);
    });

  });
});

router.get('/:INVID', passport.authenticate('bearer', { session: false }), function (req, res) {
  var invitationId = req.params.INVID;
  
  InvitationDAO.getInvitationById(invitationId, function (err, invitation) {
    if(err) return res.json(500, util.showError(err));
    res.json(200, invitation);
  });
});

router.post('/create', passport.authenticate('bearer', { session: false }), function (req, res) {
  // TODO: implement transaction
  // INSERT orders, order_items, invitations (this is the correct order)
  // need to change current method!
  var invitation = req.body;
  var custId = req.user.cust_id;
  var data;
  async.waterfall([
    // 1. input validation
    function (callback){
      var errorMessage;
      var rules = are(validationRules.invitations_rules);
      if (!rules.validFor(invitation)) {
        var invalidFields = rules.getInvalidFields();
        var errorMessage = invalidFields[Object.keys(invalidFields)[0]][0]; // only need to retrieve the last error
        callback(errorMessage);
      }
      else {
        for(var i in invitation.dishes){
          rules = are(validationRules.invitation_dishes_rules);
          if (!rules.validFor(invitation.dishes[i])) {
            var invalidFields = rules.getInvalidFields();
            var errorMessage = invalidFields[Object.keys(invalidFields)[0]][0]; // only need to retrieve the last error
            callback(errorMessage);
          }
        }
      }
      if(!errorMessage)
        callback(null, 'ok');
    },
    // 2. get the next inv_id to use
    function (arg1, callback){
      console.log('get latest invitation id');
      connection.query('SELECT inv_id FROM invitations ORDER BY inv_created_time DESC LIMIT 1', function(err, result){
        if(err)
          callback(err);
        else{
          if(typeof result !== 'undefined' && result.length > 0)
            callback(null, (result[0].inv_id)+1);
          else
            callback(null, 1); // default 1 if no current invitations exist
        }
      });
    },
    // 3. insert into orders, order_items, invitations table
    function (invitation_id, callback){
      // insert with transaction here
      connection.beginTransaction(function(err) {
        if (err) { return callback(err); }
        var totalPrice = 0;
        for(var i in invitation.dishes){
          totalPrice += (invitation.dishes[i].price * invitation.dishes[i].quantity);
        }
        var orders = {
          'o_rest_id' : invitation.restaurant_id,
          'o_cust_id' : custId,
          'o_totalprice' : totalPrice,
          'o_num_people' : invitation.customer_ids.length,
          'o_request_date' : invitation.request_date,
          'o_start_time' : invitation.start_time,
          'o_end_time' : invitation.end_time,
          'o_table_number' : 0,
          'o_status' : 1
        };
        connection.query('INSERT INTO orders SET ?', orders, function(err, result) {
          if (err) { 
            connection.rollback(function() {
              callback(err);
            });
          }
          else {
            var orderId = result.insertId;
            var orderItems = [];
            for (var i in invitation.dishes){ // creating array for bulk insert
              // oitem_order_id, oitem_name, oitem_price, oitem_quantity
              var a = [orderId, invitation.dishes[i].name, invitation.dishes[i].price, invitation.dishes[i].quantity];
              orderItems.push(a);
            }
            connection.query('INSERT INTO order_items (oitem_order_id, oitem_name, oitem_price, oitem_quantity) VALUES ?', [orderItems], function(err, result) {
              if (err) { 
                connection.rollback(function() {
                  callback(err);
                });
              }
              else {
                var data = [];
                for(var i in invitation.customer_ids){ // creating array for bulk insert
                  // inv_id, inv_cust_id, inv_order_id, inv_is_host, inv_status
                  var isHost = (invitation.customer_ids[i] == custId) ? 'true' : 'false';
                  data.push([invitation_id, invitation.customer_ids[i], orderId, isHost, (isHost === 'true' ? 'a' : 's')]);
                }
                connection.query('INSERT INTO invitations (inv_id, inv_cust_id, inv_order_id, inv_is_host, inv_status) VALUES ?', [data], function(err, result) {
                  if (err) {
                    connection.rollback(function() {
                      callback(err);
                    });
                  }
                  else {
                    connection.commit(function(err) {
                      if (err) { 
                        connection.rollback(function() {
                          callback(err);
                        });
                      }
                      else {
                        callback(null, invitation_id);
                        console.log('transaction success!');
                      }
                    });
                  }
                });
              }
            });
          }
        });
      });
    },
    // 4. get invitation details to return
    InvitationDAO.getInvitationById,
    // 5. get participants cust_push_id
    function (invitation, callback) {
      var customerIds = [];
      var queryBody = {};
      async.series([
        // fill customer ids
        function (callback) {
          _.each(invitation.participants, function (participant) {
            if(participant.is_host === 'false')
              customerIds.push(participant.cust_id);
          });
          callback(null, 'ok');
        },
        // fill query body
        function (callback) {
          queryBody.messages = {
            title: 'New invitation from '+invitation.order.customer.name,
            description: 'Let\'s eat at '+invitation.order.restaurant.name,
            custom_content : {
              invitation_id: invitation.inv_id,
              type: 'invitation'
            }
          };
          callback(null, 'ok');
        },
        // send push!
        function (callback) {
          var totalPush = util.sendPush(queryBody, customerIds);
          callback(null, 'ok');
        }
      ], function (err, result) {
        callback(null, invitation);
      });
    }
  ],
  function (err, result) {
    if (err) {
      console.error(err);
      return res.json(500, util.showError(err));
    }

    res.json(200, result);
  });
});

router.post('/book/:INVID', passport.authenticate('bearer', { session: false }), function (req, res) {
  var invitationId = req.params.INVID;
  var custId = req.user.cust_id;

  InvitationDAO.book(invitationId, custId, function (err, invitation) {
    if (err) return res.json(500, util.showError(err));
    var customerIds = [];
    var queryBody = {};
    async.series([
      // fill customer ids
      function (callback) {
        _.each(invitation.participants, function (participant) {
          if(participant.is_host === 'false')
            customerIds.push(participant.cust_id);
        });
        callback(null, 'ok');
      },
      // fill query body
      function (callback) {
        queryBody.messages = {
          title: invitation.order.customer.name + ' has just book the order!',
          description: 'Finished booking order at ' + invitation.order.restaurant.name,
          custom_content : {
            invitation_id: invitation.inv_id,
            type: 'invitation'
          }
        };
        callback(null, 'ok');
      },
      // send push!
      function (callback) {
        var totalPush = util.sendPush(queryBody, customerIds);
        callback(null, 'ok');
      }
    ], function (err, result) {
      res.json(200, invitation);
    });
  });
});

router.post('/cancel/:INVID', passport.authenticate('bearer', { session: false }), function (req, res) {
  var invitationId = req.params.INVID;
  var custId = req.user.cust_id;

  InvitationDAO.cancel(invitationId, custId, function (err, invitation) {
    if (err) return res.json(500, util.showError(err));
    var customerIds = [];
    var queryBody = {};
    async.series([
      // fill customer ids
      function (callback) {
        _.each(invitation.participants, function (participant) {
          if(participant.is_host === 'false')
            customerIds.push(participant.cust_id);
        });
        callback(null, 'ok');
      },
      // fill query body
      function (callback) {
        queryBody.messages = {
          title: invitation.order.customer.name + ' has just cancel the order!',
          description: 'Canceled booking order at ' + invitation.order.restaurant.name,
          custom_content : {
            invitation_id: invitation.inv_id,
            type: 'invitation'
          }
        };
        callback(null, 'ok');
      },
      // send push!
      function (callback) {
        var totalPush = util.sendPush(queryBody, customerIds);
        callback(null, 'ok');
      }
    ], function (err, result) {
      res.json(200, invitation);
    });
  });
});

router.post('/accept/:INVID', passport.authenticate('bearer', { session: false }), function (req, res) {
  var invitationId = req.params.INVID;
  var custId = req.user.cust_id;
  var custName;

  InvitationDAO.accept(invitationId, custId, function (err, invitation) {
    if (err) return res.json(500, util.showError(err));
    var customerIds = [];
    var queryBody = {};
    async.series([
      // fill customer ids
      function (callback) {
        _.each(invitation.participants, function (participant) {
          if(participant.cust_id != custId) // send to all except yourself!
            customerIds.push(participant.cust_id);
          else
            custName = participant.name;
        });
        callback(null, 'ok');
      },
      // fill query body
      function (callback) {
        queryBody.messages = {
          title: custName + ' has just accepted the invitation!',
          description: 'Accepted invitation at ' + invitation.order.restaurant.name,
          custom_content : {
            invitation_id: invitation.inv_id,
            type: 'invitation'
          }
        };
        callback(null, 'ok');
      },
      // send push!
      function (callback) {
        var totalPush = util.sendPush(queryBody, customerIds);
        callback(null, 'ok');
      }
    ], function (err, result) {
      res.json(200, invitation);
    });
  });
});

router.post('/deny/:INVID', passport.authenticate('bearer', { session: false }), function (req, res) {
  var invitationId = req.params.INVID;
  var custId = req.user.cust_id;
  var custName;
  
  InvitationDAO.deny(invitationId, custId, function (err, invitation) {
    if (err) return res.json(500, util.showError(err));
    var customerIds = [];
    var queryBody = {};
    async.series([
      // fill customer ids
      function (callback) {
        _.each(invitation.participants, function (participant) {
          if(participant.cust_id != custId) // send to all except yourself!
            customerIds.push(participant.cust_id);
          else
            custName = participant.name;
        });
        callback(null, 'ok');
      },
      // fill query body
      function (callback) {
        queryBody.messages = {
          title: custName + ' has just denied the invitation!',
          description: 'Denied invitation at ' + invitation.order.restaurant.name,
          custom_content : {
            invitation_id: invitation.inv_id,
            type: 'invitation'
          }
        };
        callback(null, 'ok');
      },
      // send push!
      function (callback) {
        var totalPush = util.sendPush(queryBody, customerIds);
        callback(null, 'ok');
      }
    ], function (err, result) {
      res.json(200, invitation);
    });
  });
});

module.exports = router;
