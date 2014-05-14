var express = require('express'),
    router = express.Router(),
    iz = require('iz'),
    are = iz.are,
    validators = iz.validators,
    validationRules = require('../utils/validation_rules'),
    util = require('../utils/util'),
    db = require('../utils/database'),
    connection = db.connection(),
    async = require('async');

router.get('/', function(req, res) {
  var query, sql;
  var custId = req.param('customer_id');
  var onlySent = (req.param('only_sent') ? true : false); // if onlySent > WHERE inv_is_host LIKE 'true'
  var onlyRcv = (req.param('only_received') ? true : false); // if onlyRcv > WHERE inv_is_host LIKE 'false'
  if(onlySent || onlyRcv) {
    if(onlySent) {
      sql = 'SELECT * FROM invitations WHERE inv_cust_id = ? AND inv_is_host LIKE "true"';
    }
    else if(onlyRcv) {
      sql = 'SELECT * FROM invitations WHERE inv_cust_id = ? AND inv_is_host LIKE "false"';
    }
  }
  else {
    sql = 'SELECT * FROM invitations WHERE inv_cust_id = ?';
  }
  if(!custId)
    res.json(400, util.showError('missing customer ID'));
  else {
    async.waterfall([
      function(callback){
        // GET INVITATION
        query = connection.query(sql,custId, function(err, result){
          if(err)
            callback('error');
          else {
            if(typeof result !== 'undefined' && result.length > 0){
              callback(null, result);
            }
            else {
              callback('not exist');
            }
          }
        });
      }
    ], function(err, result){
        if(err){
          if(err === 'error')
            res.json(400, util.showError('unexpected error'));
          else if(err === 'not exist')
            res.json(400, util.showError('invitation does not exist'));
          else
            res.json(400, err);
        }
        else
          res.json(200, result);
    });
  }
});

router.get('/:INVID', function(req, res) {
  var query;
  var invitationId = req.params.INVID;
  var custId = req.param('customer_id');
  if(!custId)
    res.json(400, util.showError('missing customer ID'));
  else {
    async.waterfall([
      function(callback){
        var sql = 'SELECT cust_id, cust_name, inv_order_id, inv_is_host, inv_created_time, inv_status '
                +'FROM invitations, customer_accounts WHERE inv_cust_id = cust_id and inv_id = ?';
        query = connection.query(sql, invitationId, function(err, result){
          if(err)
            callback('error');
          else {
            if(typeof result !== 'undefined' && result.length > 0){
              var data = {
                'inv_id' : invitationId,
                'created_time' : result[0].inv_created_time,
                'participants' : []
              };
              for(var i in result){
                var participant = {
                  'cust_id' : result[i].cust_id,
                  'name' : result[i].cust_name
                };
                if(result[i].inv_is_host)
                  participant.is_host = result[i].inv_is_host;
                else
                  participant.inv_status = result[i].inv_status;
                data.participants.push(participant);
              }
              callback(null, data, result[0].inv_order_id);
            }
            else
              callback('not exist');
          }
        });
      },
      function(arg1, arg2, callback){
        var sql = 'SELECT rest_id, rest_name, rest_address, rest_geo_location, rest_pic, rest_pic_thumb, cust_id, '
              +'cust_name, o_id, o_totalprice, o_num_people, o_request_date, o_request_period, '
              +'o_schedule_info, o_status, o_created_time, o_updated_time '
              +'FROM orders, restaurants, customer_accounts '
              +'WHERE o_rest_id = rest_id and o_cust_id = cust_id and o_id = ?';
        query = connection.query(sql, arg2, function(err, result){
          if(err)
            callback('error');
          else{
            if(typeof result !== 'undefined' && result.length > 0){
              var order = {
                'o_id' : result[0].o_id,
                'restaurant' : {
                  'rest_id' : result[0].rest_id,
                  'name' : result[0].rest_name,
                  'address' : result[0].rest_address,
                  'geo_location' : {
                    'longitude' : result[0].rest_geo_location.x,
                    'latitude' : result[0].rest_geo_location.y
                  },
                  'pic' : result[0].rest_pic,
                  'pic_thumb' : result[0].rest_pic_thumb,
                },
                'customer' : {
                  'cust_id' : result[0].cust_id,
                  'name' : result[0].cust_name
                },
                'dishes' : [],
                'total_price' : result[0].o_totalprice,
                'num_people' : result[0].o_num_people,
                'request_date' : result[0].o_request_date,
                'request_period' : result[0].o_request_period,
                'schedule_info' : result[0].o_schedule_info,
                'status': result[0].o_status,
                'created_time' : result[0].o_created_time,
                'updated_time' : result[0].o_updated_time
              };
              arg1.order = order;
              callback(null, arg1);
            }
            else
              callback('not exist');
          }
        });
      },
      function(arg1, callback){ 
      // Get the Dishes from order_items
      var sql = 'SELECT oitem_name, oitem_price, oitem_quantity FROM order_items WHERE oitem_order_id = ?';
      query = connection.query(sql, JSON.stringify(arg1.order.o_id), function(err, result){
        if(err)
          callback('error');
        else{
          for(var i in result){
            var data = {
              //'d_id' : ? 
              'name' : result[i].oitem_name,
              'price' : result[i].oitem_price,
              'quantity' : result[i].oitem_quantity
            };
            arg1.order.dishes.push(data);
          }
          callback(null, arg1);
        }
      });
    },
    ], function(err, result){
      if(err){
        if(err === 'error')
          res.json(400, util.showError('unexpected error'));
        else if(err === 'not exist')
          res.json(400, util.showError('something not exist yet'));
        else
          res.json(400, util.showError(err))
      }
      else {
        res.json(200, result);
      }
    });
  }
});

router.post('/create', function(req, res) {
  // TODO: implement transaction
  // INSERT orders, order_items, invitations (this is the correct order)
  // need to change current method!
  var invitation = req.body;
  var data;
  // validate input first
  async.waterfall([
    function(callback){
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
    function(arg1, callback){
      console.log('get latest invitation id');
      connection.query('SELECT inv_id FROM invitations ORDER BY inv_created_time DESC LIMIT 1', function(err, result){
        if(err)
          callback('db error');
        else{
          if(typeof result !== 'undefined' && result.length > 0)
            callback(null, (result[0].inv_id)+1);
          else
            callback(null, 1); // default 1 if no current invitations exist
        }
      });
    },
    function(arg1, callback){ // arg1 : invitation id
      // insert with transaction here
      connection.beginTransaction(function(err) {
        if (err) { callback('db error'); }
        var totalPrice = 0;
        for(var i in invitation.dishes){
          totalPrice += (invitation.dishes[i].price * invitation.dishes[i].quantity);
        }
        var orders = {
          'o_rest_id' : invitation.restaurant_id,
          'o_cust_id' : invitation.customer_id,
          'o_totalprice' : totalPrice,
          'o_num_people' : invitation.customer_ids.length,
          'o_request_date' : invitation.request_date,
          'o_request_period' : invitation.request_period,
          'o_schedule_info' : '', // TODO : What to fill?
          'o_status' : 1 // TODO : What to fill? (Default when create is 1?)
        };
        connection.query('INSERT INTO orders SET ?', orders, function(err, result) {
          if (err) { 
            connection.rollback(function() {
              callback('db error');
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
                  console.log(err);
                  callback('db error');
                });
              }
              else {
                var data = [];
                for(var i in invitation.customer_ids){ // creating array for bulk insert
                  // inv_id, inv_cust_id, inv_order_id, inv_is_host, inv_status
                  var isHost = (invitation.customer_ids[i] == invitation.customer_id) ? 'true' : 'false';
                  var a = [arg1, invitation.customer_ids[i], orderId, isHost , 's'];
                  data.push(a);
                }
                connection.query('INSERT INTO invitations (inv_id, inv_cust_id, inv_order_id, inv_is_host, inv_status) VALUES ?', [data], function(err, result) {
                  if (err) {
                    connection.rollback(function() {
                      callback('db error');
                    });
                  }
                  else {
                    connection.commit(function(err) {
                      if (err) { 
                        connection.rollback(function() {
                          callback('db error');
                        });
                      }
                      else {
                        callback(null, arg1); // pass the invitation id to the next iteration
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
    function(arg1, callback){ // arg1 : invitation id
      // lets try doing one select here for the return json result
      var sql = 'SELECT cust_id, cust_name, inv_order_id, inv_is_host, inv_created_time, inv_status '
                +'FROM invitations, customer_accounts WHERE inv_cust_id = cust_id and inv_id = ?';
      connection.query(sql, arg1, function(err, result) {
        if(err) callback('db error');
        else {
          if(typeof result !== 'undefined' && result.length > 0){
            var dataInvitations = {
              'inv_id' : arg1,
              'created_time' : result[0].inv_created_time,
              'participants' : [],
              'order' : {}
            };
            for(var i in result){
              var participant = {
                'cust_id' : result[i].cust_id,
                'name' : result[i].cust_name
              };
              if(result[i].inv_is_host)
                participant.is_host = result[i].inv_is_host;
              else
                participant.inv_status = result[i].inv_status;
              dataInvitations.participants.push(participant);
            }
            sql = 'SELECT rest_id, rest_name, rest_address, rest_geo_location, rest_pic, rest_pic_thumb, cust_id, '
              +'cust_name, o_id, o_totalprice, o_num_people, o_request_date, o_request_period, '
              +'o_schedule_info, o_status, o_created_time, o_updated_time '
              +'FROM orders, restaurants, customer_accounts '
              +'WHERE o_rest_id = rest_id and o_cust_id = cust_id and o_id = ?';
            connection.query(sql, result[0].inv_order_id, function(err, result) {
              if(err) callback('db error');
              else {
                if(typeof result !== 'undefined' && result.length > 0){
                  dataInvitations.order = {
                    'o_id' : result[0].o_id,
                    'restaurant' : {
                      'rest_id' : result[0].rest_id,
                      'name' : result[0].rest_name,
                      'address' : result[0].rest_address,
                      'geo_location' : {
                        'longitude' : result[0].rest_geo_location.x,
                        'latitude' : result[0].rest_geo_location.y
                      },
                      'pic' : result[0].rest_pic,
                      'pic_thumb' : result[0].rest_pic_thumb,
                    },
                    'customer' : {
                      'cust_id' : result[0].cust_id,
                      'name' : result[0].cust_name
                    },
                    'dishes' : [],
                    'total_price' : result[0].o_totalprice,
                    'num_people' : result[0].o_num_people,
                    'request_date' : result[0].o_request_date,
                    'request_period' : result[0].o_request_period,
                    'schedule_info' : result[0].o_schedule_info,
                    'status': result[0].o_status,
                    'created_time' : result[0].o_created_time,
                    'updated_time' : result[0].o_updated_time
                  };
                  sql = 'SELECT oitem_name, oitem_price, oitem_quantity FROM order_items WHERE oitem_order_id = ?';
                  connection.query(sql, dataInvitations.order.o_id, function(err, result) {
                    if(err) callback('db error');
                    else {
                      if(typeof result !== 'undefined' && result.length > 0){
                        for(var i in result){
                          var oItem = {
                            //'d_id' : ? 
                            'name' : result[i].oitem_name,
                            'price' : result[i].oitem_price,
                            'quantity' : result[i].oitem_quantity
                          };
                          dataInvitations.order.dishes.push(oItem);
                        }
                        callback(null, dataInvitations);
                      }
                    }
                  });
                }
              }
            });
          }
        }
      });
    }
  ], function(err, result){
    if(err){
      if(err === 'db error') res.json(400, util.showError('database error'));
      else { // expecting error from invalid fields
        res.json(400, util.showError(err));
      }
    }
    else
      res.json(200, result);
  });
});

router.post('/accept/:INVID', function(req, res) {
  var query;
  var invitationId = req.params.INVID;
  var custId = req.body.customer_id;
  if(!custId)
    res.json(400, util.showError('missing customer ID'));
  else {
    async.waterfall([
      function(callback){
        // update inv_status
        query = connection.query('UPDATE invitations SET inv_status = "a" WHERE inv_id = ? AND inv_cust_id = ?', [invitationId, custId], function(err, result){
          if(err)
            callback('error');
          else{
            callback(null, 'ok');
          }
        });
      },
      function(arg1, callback){
        var sql = 'SELECT cust_id, cust_name, inv_order_id, inv_is_host, inv_created_time, inv_status '
                +'FROM invitations, customer_accounts WHERE inv_cust_id = cust_id and inv_id = ?';
        query = connection.query(sql, invitationId, function(err, result){
          if(err)
            callback('error');
          else {
            if(typeof result !== 'undefined' && result.length > 0){
              var data = {
                'inv_id' : invitationId,
                'created_time' : result[0].inv_created_time,
                'participants' : []
              };
              for(var i in result){
                var participant = {
                  'cust_id' : result[i].cust_id,
                  'name' : result[i].cust_name
                };
                if(result[i].inv_is_host)
                  participant.is_host = result[i].inv_is_host;
                else
                  participant.inv_status = result[i].inv_status;
                data.participants.push(participant);
              }
              callback(null, data, result[0].inv_order_id);
            }
            else
              callback('not exist');
          }
        });
      },
      function(arg1, arg2, callback){
        var sql = 'SELECT rest_id, rest_name, rest_address, rest_geo_location, rest_pic, rest_pic_thumb, cust_id, '
              +'cust_name, o_id, o_totalprice, o_num_people, o_request_date, o_request_period, '
              +'o_schedule_info, o_status, o_created_time, o_updated_time '
              +'FROM orders, restaurants, customer_accounts '
              +'WHERE o_rest_id = rest_id and o_cust_id = cust_id and o_id = ?';
        query = connection.query(sql, arg2, function(err, result){
          if(err)
            callback('error');
          else{
            if(typeof result !== 'undefined' && result.length > 0){
              var order = {
                'o_id' : result[0].o_id,
                'restaurant' : {
                  'rest_id' : result[0].rest_id,
                  'name' : result[0].rest_name,
                  'address' : result[0].rest_address,
                  'geo_location' : {
                    'longitude' : result[0].rest_geo_location.x,
                    'latitude' : result[0].rest_geo_location.y
                  },
                  'pic' : result[0].rest_pic,
                },
                'customer' : {
                  'cust_id' : result[0].cust_id,
                  'name' : result[0].cust_name
                },
                'dishes' : [],
                'total_price' : result[0].o_totalprice,
                'num_people' : result[0].o_num_people,
                'request_date' : result[0].o_request_date,
                'request_period' : result[0].o_request_period,
                'schedule_info' : result[0].o_schedule_info,
                'status': result[0].o_status,
                'created_time' : result[0].o_created_time,
                'updated_time' : result[0].o_updated_time
              };
              arg1.order = order;
              callback(null, arg1);
            }
            else
              callback('not exist');
          }
        });
      },
      function(arg1, callback){ 
      // Get the Dishes from order_items
      var sql = 'SELECT oitem_name, oitem_price, oitem_quantity FROM order_items WHERE oitem_order_id = ?';
      query = connection.query(sql, JSON.stringify(arg1.order.o_id), function(err, result){
        if(err)
          callback('error');
        else{
          for(var i in result){
            var data = {
              //'d_id' : ? 
              'name' : result[i].oitem_name,
              'price' : result[i].oitem_price,
              'quantity' : result[i].oitem_quantity
            };
            arg1.order.dishes.push(data);
          }
          callback(null, arg1);
        }
      });
    },
    ], function(err, result){
      if(err){
        if(err === 'error')
          res.json(400, util.showError('unexpected error'));
        else if(err === 'not exist')
          res.json(400, util.showError('not exist'));
        else
          res.json(400, util.showError(err))
      }
      else {
        res.json(200, result);
      }
    });
  }
});

router.post('/deny/:INVID', function(req, res) {
  var query;
  var invitationId = req.params.INVID;
  var custId = req.body.customer_id;
  if(!custId)
    res.json(400, util.showError('missing customer ID'));
  else {
    async.waterfall([
      function(callback){
        // update inv_status
        query = connection.query('UPDATE invitations SET inv_status = "d" WHERE inv_id = ? AND inv_cust_id = ?', [invitationId, custId], function(err, result){
          if(err)
            callback('error');
          else{
            callback(null, 'ok');
          }
        });
      },
      function(arg1, callback){
        var sql = 'SELECT cust_id, cust_name, inv_order_id, inv_is_host, inv_created_time, inv_status '
                +'FROM invitations, customer_accounts WHERE inv_cust_id = cust_id and inv_id = ?';
        query = connection.query(sql, invitationId, function(err, result){
          if(err)
            callback('error');
          else {
            if(typeof result !== 'undefined' && result.length > 0){
              var data = {
                'inv_id' : invitationId,
                'created_time' : result[0].inv_created_time,
                'participants' : []
              };
              for(var i in result){
                var participant = {
                  'cust_id' : result[i].cust_id,
                  'name' : result[i].cust_name
                };
                if(result[i].inv_is_host)
                  participant.is_host = result[i].inv_is_host;
                else
                  participant.inv_status = result[i].inv_status;
                data.participants.push(participant);
              }
              callback(null, data, result[0].inv_order_id);
            }
            else
              callback('not exist');
          }
        });
      },
      function(arg1, arg2, callback){
        var sql = 'SELECT rest_id, rest_name, rest_address, rest_geo_location, rest_pic, rest_pic_thumb, cust_id, '
              +'cust_name, o_id, o_totalprice, o_num_people, o_request_date, o_request_period, '
              +'o_schedule_info, o_status, o_created_time, o_updated_time '
              +'FROM orders, restaurants, customer_accounts '
              +'WHERE o_rest_id = rest_id and o_cust_id = cust_id and o_id = ?';
        query = connection.query(sql, arg2, function(err, result){
          if(err)
            callback('error');
          else{
            if(typeof result !== 'undefined' && result.length > 0){
              var order = {
                'o_id' : result[0].o_id,
                'restaurant' : {
                  'rest_id' : result[0].rest_id,
                  'name' : result[0].rest_name,
                  'address' : result[0].rest_address,
                  'geo_location' : {
                    'longitude' : result[0].rest_geo_location.x,
                    'latitude' : result[0].rest_geo_location.y
                  },
                  'pic' : result[0].rest_pic,
                  'pic_thumb' : result[0].rest_pic_thumb,
                },
                'customer' : {
                  'cust_id' : result[0].cust_id,
                  'name' : result[0].cust_name
                },
                'dishes' : [],
                'total_price' : result[0].o_totalprice,
                'num_people' : result[0].o_num_people,
                'request_date' : result[0].o_request_date,
                'request_period' : result[0].o_request_period,
                'schedule_info' : result[0].o_schedule_info,
                'status': result[0].o_status,
                'created_time' : result[0].o_created_time,
                'updated_time' : result[0].o_updated_time
              };
              arg1.order = order;
              callback(null, arg1);
            }
            else
              callback('not exist');
          }
        });
      },
      function(arg1, callback){ 
      // Get the Dishes from order_items
      var sql = 'SELECT oitem_name, oitem_price, oitem_quantity FROM order_items WHERE oitem_order_id = ?';
      query = connection.query(sql, JSON.stringify(arg1.order.o_id), function(err, result){
        if(err)
          callback('error');
        else{
          for(var i in result){
            var data = {
              //'d_id' : ? 
              'name' : result[i].oitem_name,
              'price' : result[i].oitem_price,
              'quantity' : result[i].oitem_quantity
            };
            arg1.order.dishes.push(data);
          }
          callback(null, arg1);
        }
      });
    },
    ], function(err, result){
      if(err){
        if(err === 'error')
          res.json(400, util.showError('unexpected error'));
        else if(err === 'not exist')
          res.json(400, util.showError('not exist'));
        else
          res.json(400, util.showError(err))
      }
      else {
        res.json(200, result);
      }
    });
  }
});

module.exports = router;