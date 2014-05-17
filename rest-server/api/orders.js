var express = require('express'),
    router = express.Router(),
    util = require('../utils/util'),
    async = require('async');

var OrderDAO = require('../model/Order');


router.get('/', function (req, res) {
  if (!req.session.manager) {
    return res.json(401, util.showError('please login first'));
  }
  var rest_id = req.session.manager.rest_id;

  if (req.query.pending_only === 'true' && req.query.booked_only === 'true')
    return res.json(400, util.showError('pending_only and booked_only cannot both be true!'));

  OrderDAO.getOrders(
    rest_id,
    req.query.pending_only === 'true',
    req.query.booked_only === 'true',
    req.query.since,
    req.query.until,
    function (err, orders) {
      if (err) throw err;
      res.json(200, orders);
    }
  );
});


router.post('/accept/:OID', function(req, res) {
  if (!req.session.manager) {
    return res.json(401, util.showError('please login first'));
  }
  var restaurantId = req.session.manager.rest_id;
  var orderId = req.params.OID;
  var tableNumber = req.body.table_number;
  
  async.series([
    // 1. check if the order is in valid state
    function (callback) {
      OrderDAO.getOrderById(orderId, function (err, order) {
        if (err) return callback(err);
        if (!order)
          return callback('order not found!');
        if (order.restaurant.rest_id != restaurantId)
          return callback('order not found!')

        switch (order.status) {
          case OrderDAO.STATE.CANCELED:
            return callback('The customer has canceled the order!');
          case OrderDAO.STATE.BOOKING:
            return callback(null);  // good state, go to next step
          default:
            return callback('Invalid order status: ' + order.status);
        }
      });
    },
    // 2. TODO check if the table is still available
    // 3. update the status and table_number
    function (callback) {
      var sql = 'UPDATE orders SET o_status=?, o_table_number=? WHERE o_id = ?';
      connection.query(sql, [OrderDAO.STATE.BOOKING_SUCCEED, tableNumber, orderId], function (err, results) {
        if (err) return callback(err);
        callback(null);
      });
    }],
  function (err, results) {
    if (err)
      return res.json(400, util.showError(err));
    res.json(200, 'ok');
  });  // end series
});


router.post('/deny/:OID', function(req, res) {
  if (!req.session.manager) {
    return res.json(401, util.showError('please login first'));
  }
  var restaurantId = req.session.manager.rest_id;
  var orderId = req.params.OID;

  OrderDAO.changeState(
    orderId, restaurantId, OrderDAO.STATE.BOKKING_FAILED,
    function (err, results) {
      if (err)
        return res.json(400, util.showError(err));
      res.json(200, 'ok');
    }
  );
});


router.post('/consume/:OID', function(req, res) {
  if (!req.session.manager) {
    return res.json(401, util.showError('please login first'));
  }
  var restaurantId = req.session.manager.rest_id;
  var orderId = req.params.OID;
  
  OrderDAO.changeState(
    orderId, restaurantId, OrderDAO.STATE.CONSUMED,
    function (err, results) {
      if (err)
        return res.json(400, util.showError(err));
      res.json(200, 'ok');
    }
  );
});

module.exports = router;