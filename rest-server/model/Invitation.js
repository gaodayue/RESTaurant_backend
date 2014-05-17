var db = require('../utils/database'),
    connection = db.connection(),
    async = require('async'),
    _ = require('underscore');

var OrderDAO = require('../model/Order');

function isCustomerInInvitation(dao, invitationId, custId, hostOnly) {
  return function (callback) {
    dao.getInvitationById(invitationId, function (err, invitation) {
      if (err) return callback(err);
      
      var found = _.find(invitation.participants, function (participant) {
        return participant.cust_id == custId;
      });
      
      if (!found)
        return callback('customer not in the invitation!');

      if (hostOnly && !found.is_host)
        return callback("customer is not the host of invitation!");

      return callback(null, invitation);
    });
  };
}

function checkNumberOfAccept (invitation, callback) {
  // get number of people accept -> from invitation.participants.inv_status
  // compare this number with the num_people in order
  // if !equal, update the num_people in order
  var num_accept = _.reduce(invitation.participants, function (acc, participant) {
    return acc + (participant.inv_status == 'accepted' ? 1 : 0);
  }, 0);

  if (num_accept == invitation.order.num_people)
    return callback(null, invitation);
  
  // update the num_people in order
  invitation.order.num_people = num_accept;
  var sql = 'UPDATE orders SET o_num_people = ? WHERE o_id = ?';
  connection.query(sql, [num_accept, invitation.order.o_id], function (err, results) {
    if (err) return callback(err);
    callback(null, invitation);
  });
}

module.exports = {

  book: function (invitationId, custId, callback) {
    async.waterfall([
      // 1. determine if the customer is the host of the invitation
      isCustomerInInvitation(this, invitationId, custId, true),
      // 2. determine if all participants have accepted the invitation
      checkNumberOfAccept,
      // 3. update order state to booked
      function (invitation, callback) {
        var order = invitation.order;
        OrderDAO.changeState(
          order.o_id, order.restaurant.rest_id, OrderDAO.STATE.BOOKING,
          function (err, results) {
            if (err) return callback(err);
            callback(null, invitation);
          }
        );
      }],
    function (err, invitation) {
      if (err) return callback(err);
      // success, change the order status and return
      invitation.order.status = OrderDAO.STATE.BOOKING;
      callback(null, invitation);
    }); // end waterfall
  },

  cancel: function (invitationId, custId, callback) {
    async.waterfall([
      // 1. determine if the customer is the host of the invitation
      isCustomerInInvitation(this, invitationId, custId, true),
      // 2. determine if all participants have accepted the invitation
      //checkNumberOfAccept,
      // 3. update order state to booked
      function (invitation, callback) {
        var order = invitation.order;
        OrderDAO.changeState(
          order.o_id, order.restaurant.rest_id, OrderDAO.STATE.CANCELED,
          function (err, results) {
            if (err) return callback(err);
            callback(null, invitation);
          }
        );
      }],
    function (err, invitation) {
      if (err) return callback(err);
      // success, change the order status and return
      invitation.order.status = OrderDAO.STATE.CANCELED;
      callback(null, invitation);
    }); // end waterfall
  },

  accept: function (invitationId, custId, callback) {
    async.waterfall([
      // 1. determine if the customer is in the invitation
      isCustomerInInvitation(this, invitationId, custId),
      // 2. update states of the invitation
      function (invitation, callback) {
        var sql = 'UPDATE invitations SET inv_status = "a" WHERE inv_id = ? AND inv_cust_id = ?';
        connection.query(sql, [invitationId, custId], function (err, results) {
          if (err) return callback(err);
          callback(null, invitation);
        });
      }],
    function (err, invitation) {
      if (err) return callback(err);
      // success, change the invitation status and return
      _.each(invitation.participants, function (participant) {
        if (participant.cust_id == custId) {
          participant.inv_status = 'accepted';
        }
      });

      callback(null, invitation);
    }); // end waterfall
  },

  deny: function (invitationId, custId, callback) {
    var dao = this;
    async.waterfall([
      // 1. determine if the customer is in the invitation
      isCustomerInInvitation(this, invitationId, custId),
      // 2. update states of the invitation
      function (invitation, callback) {
        var sql = 'UPDATE invitations SET inv_status = "d" WHERE inv_id = ? AND inv_cust_id = ?';
        connection.query(sql, [invitationId, custId], function (err, results) {
          if (err) return callback(err);
          callback(null, invitation);
        });
      }],
    function (err, invitation) {
      if (err) return callback(err);
      // success, change the invitation status and return
      _.each(invitation.participants, function (participant) {
        if (participant.cust_id == custId) {
          participant.inv_status = 'denied';
        }
      });

      callback(null, invitation);
    }); // end waterfall
  },
  
  getInvitationById: function (invitationId, callback) {
    async.waterfall([
      // get invitaion info
      function (callback) {
        var sql = 'SELECT cust_id, cust_name, inv_order_id, inv_is_host, inv_created_time, inv_status '
                + 'FROM invitations, customer_accounts WHERE inv_cust_id = cust_id and inv_id = ?';
        connection.query(sql, invitationId, function (err, results) {
          if(err) return callback(err);
          if (results.length == 0) return callback('invitation not found');
          
          var invitation = {
            'inv_id':       invitationId,
            'created_time': results[0].inv_created_time,
            'participants': [],
            'order':        null
          };
          
          _.each(results, function (inv_item) {
            var status;
            switch (inv_item.inv_status) {
              case 's':
                status = 'noreply';
                break;
              case 'a':
                status = 'accepted';
                break;
              case 'd':
                status = 'denied';
                break;
            }

            invitation.participants.push({
              'cust_id':   inv_item.cust_id,
              'name': inv_item.cust_name,
              'is_host':   inv_item.inv_is_host,
              'inv_status': status
            });
          });
          
          callback(null, invitation, results[0].inv_order_id);
        });
      },
      // fill order object
      function (invitation, orderId, callback) {
        OrderDAO.getOrderById(orderId, function (err, order) {
          if (err) return callback(err);
          if (!order) return callback('order not found');
          invitation.order = order;
          callback(null, invitation);
        });
      },
      // fill restaurant detail into invitation.order.restaurant
      function (invitation, callback) {
        // TODO better use a RestaurantDAO
        connection.query(
          'SELECT * FROM restaurants WHERE rest_id = ?',
          [invitation.order.restaurant.rest_id],
          function (err, results) {
            if (err) return callback(err);
            if (results.length == 0) return callback('restaurant no found');
            invitation.order.restaurant = {
              "rest_id":  results[0].rest_id,
              "name":     results[0].rest_name,
              "address":  results[0].rest_address,
              "geo_location": {
                "longitude":  results[0].rest_geo_location.x,
                "latitude":   results[0].rest_geo_location.y
              },
              "pic":      results[0].rest_pic,
              "pic_thumb":results[0].rest_pic_thumb
            };
            callback(null, invitation);
          }
        );
      }
    ],
    function (err, invitation) {
      if(err) return callback(err);
      callback(null, invitation);
    }); // end waterfall
  }


};