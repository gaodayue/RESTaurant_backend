var db = require('../utils/database'),
    connection = db.connection(),
    async = require('async'),
    _ = require('underscore');

var ORDER_STATE = {
  PLANNING: 1,
  BOOKING: 2,
  BOOKING_SUCCEED: 3,
  BOKKING_FAILED: 4,
  CANCELED: 5,
  REVOKED: 6,
  CONSUMED: 7
};

// return a list of orders object with the structure:
// {
//   "o_id": 40001,
//   "restaurant": {
//     "rest_id": 00001
//   },
//   "customer": {
//     "cust_id": 1,
//     "name": "John",
//     "phoneno": "13812341234"
//   },
//   "dishes": [
//     {
//       "name": "Big Mac",
//       "price": "18",
//       "quantity": 3
//     }
//   ],
//   "total_price": "54",
//   "num_people": 2,
//   "request_date": "2014-05-05",
//   "start_time": 17,
//   "end_time": 19,
//   "table_number": 0,
//   "status": 1,
//   "created_time": "2014-05-05 11:20:33",
//   "updated_time": "2014-05-05 11:20:33"
// }
function _getOrders (whereClause, orderBy, callback) {
  var sql = 'SELECT o_id, o_rest_id, o_cust_id, o_totalprice, o_num_people,' +
                  ' o_request_date, o_start_time, o_end_time, o_table_number,' +
                  ' o_status, o_created_time, o_updated_time,' +
                  ' cust_name, cust_phoneno ' +
            'FROM orders ' +
            'JOIN customer_accounts ON o_cust_id = cust_id';
  if (whereClause) {
    sql += ' WHERE ' + whereClause;
  }
  if (orderBy) {
    sql += ' ORDER BY ' + orderBy;
  }

  // select all matching orders
  connection.query(sql, null, function (err, resultOrders) {
    if (err) return callback(err);
    if (!resultOrders) return callback(null, []);

    // create a series of tasks to get order items info for each order
    var tasks = [];
    _.each(resultOrders, function (order) {
      tasks.push(function (cb) {
        var sql = 'SELECT oitem_name as name, oitem_price as price, oitem_quantity as quantity ' +
                  'FROM order_items ' +
                  'WHERE oitem_order_id = ? ORDER BY oitem_id asc';
        connection.query(sql, order.o_id, function (err, dishesForOneOrder) {
          if (err) return cb(err);
          cb(null, dishesForOneOrder);
        });
      });
    });

    // execute tasks in series
    async.series(tasks, function (err, resultDishes) {
      if (err) return callback(err);
      
      var finalResult = [];
      _.each(resultOrders, function (order, i) {
        finalResult.push({
          "o_id":           order.o_id,
          "restaurant": {
            "rest_id": order.o_rest_id
          },
          "customer": {
            "cust_id":  order.o_cust_id,
            "name":     order.cust_name,
            "phoneno":  order.cust_phoneno 
          },
          "dishes":         resultDishes[i],
          "total_price":    order.o_totalprice,
          "num_people":     order.o_num_people,
          "request_date":   order.o_request_date,
          "start_time":     order.o_start_time,
          "end_time":       order.o_end_time,
          "table_number":   order.o_table_number,
          "status":         order.o_status,
          "created_time":   order.o_created_time,
          "updated_time":   order.o_updated_time
        });
      });

      callback(null, finalResult);
    });
  });
}

module.exports = {
  STATE: ORDER_STATE,

  changeState: function (orderId, restId, newState, callback) {
    var dao = this;
    async.series([
      // 1. check order exists and the order belongs to the restaurant
      function (callback) {
        dao.getOrderById(orderId, function (err, order) {
          if (err)
            return callback(err);
          if (!order)
            return callback('order not found!');
          if (order.restaurant.rest_id != restId)
            return callback('order ' + orderId + ' not belong to restaurant ' + restId);
          
          callback(null);
        });
      },
      // 2. update order states
      function (callback) {
        var sql = 'UPDATE orders SET o_status = ?, o_updated_time = ? WHERE o_id = ?';
        connection.query(sql, [newState, new Date(), orderId], function (err, results) {
          if (err) return callback(err);
          callback(null);
        });
      }],
    function (err, results) {
      if (err) return callback(err);
      callback(null);
    });
  },

  getOrderById: function (orderId, callback) {
    var whereClause = 'o_id = ' + connection.escape(orderId); 
    _getOrders(whereClause, null, function (err, results) {
      if (err) return callback(err);

      if (results.length > 0)
        callback(null, results[0]);
      else
        callback(null, null);
    });
  },

  // pendingOnly and bookedOnly cannot both be true
  // sinceDate and untilDate are optional, and should be in 'yyyy-mm-dd' format.
  getOrders: function (restId, pendingOnly, bookedOnly, sinceDate, untilDate, callback) {
    var whereClause = 'o_rest_id = ' + connection.escape(restId);
    if (pendingOnly)
      whereClause  += ' AND o_status = ' + connection.escape(ORDER_STATE.BOOKING);
    if (bookedOnly)
      whereClause  += ' AND o_status = ' + connection.escape(ORDER_STATE.BOOKING_SUCCEED);
    // always exclude orders in planning state
    if (!pendingOnly && !bookedOnly)
      whereClause  += ' AND o_status != ' + connection.escape(ORDER_STATE.PLANNING);

    if (sinceDate)
      whereClause  += ' AND o_request_date >= ' + connection.escape(sinceDate);
    if (untilDate)
      whereClause  += ' AND o_request_date <= ' + connection.escape(untilDate);
    
    _getOrders(whereClause, 'o_id asc', function (err, results) {
      if (err) return callback(err);
      callback(null, results);
    });
  }
};