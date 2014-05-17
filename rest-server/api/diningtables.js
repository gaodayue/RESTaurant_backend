var express = require('express'),
    router = express.Router(),
    util = require('../utils/util'),
    db = require('../utils/database'),
    connection = db.connection(),
    async = require('async'),
    _ = require('underscore');

var OrderDAO = require('../model/Order');

// return list of tables
router.get('/', function (req, res) {
  if (!req.session.manager) {
    return res.json(401, util.showError('please login first'));
  }
  var rest_id = req.session.manager.rest_id;
  var sql = 'SELECT tbl_id, tbl_table_number as table_number, tbl_capacity as capacity ' +
            'FROM dining_tables WHERE tbl_rest_id=? ORDER BY tbl_table_number';
  connection.query(sql, [rest_id], function (err, result) {
    if (err) throw err;
    return res.json(result);
  });
});

// get list of available tables
router.get('/available', function (req, res) {
  if (!req.session.manager) {
    return res.json(401, util.showError('please login first'));
  }
  var rest_id = req.session.manager.rest_id;
  // input params
  var request_date = req.query.request_date;
  var start_time = req.query.start_time;
  var end_time = req.query.end_time;
  var num_people = req.query.num_people;

  async.waterfall([
    // 1. get all tables
    function (callback) {
      var sql = 'SELECT tbl_id, tbl_table_number as table_number, tbl_capacity as capacity ' +
                'FROM dining_tables WHERE tbl_rest_id=? ORDER BY tbl_table_number';

      connection.query(sql, [rest_id], function (err, tables) {
        if (err) return callback(err);
        callback(null, tables);
      });
    },
    // 2. compute available tables
    function (tables, callback) {
      OrderDAO.getOrders(
        rest_id,
        false,  // pendingOnly
        true,   // bookedOnly
        request_date, // sinceDate
        request_date, // untilDate
        function (err, orders) {
          if (err) return callback(err);
          var availTables = _.filter(tables, function (table) {
            // filter table whose capacity is not enough
            if (table.capacity < num_people)
              return false;
            // filter table which already has order in that request period
            var alreadyOrdered = false;
            _.each(orders, function (order) {
              if (table.table_number != order.table_number) return;
              if (order.start_time >= start_time && order.start_time < end_time)
                alreadyOrdered = true;
              if (order.end_time > start_time && order.end_time <= end_time)
                alreadyOrdered = true;
            });
            return !alreadyOrdered;
          });
          callback(null, availTables);
        });
    }],
  function (err, availTables) {
    if (err)
      return res.json(401, util.showError(err));
    res.json(200, availTables);
  }); // end waterfall

});

// update list of tables
router.post('/', function (req, res) {
  if (!req.session.manager) {
    return res.json(401, util.showError('please login first'));
  }
  var rest_id = req.session.manager.rest_id;
  // TODO validation on body here
  var tables = req.body;

  // TODO transaction!!!
  var tasks = [];
  _.each(tables, function (table) {
    if (table.tbl_id) { // an update task
      tasks.push(function (callback) {
        var sql = 'UPDATE dining_tables ' +
                  'SET tbl_table_number=?, tbl_capacity=? WHERE tbl_id=?';
        connection.query(sql, [table.table_number, table.capacity, table.tbl_id], function (err, result) {
          if (err) return callback(err);
          callback(null, table);
        });
      });
    
    } else {  // an insertion task
      tasks.push(function (callback) {
        var sql = "INSERT INTO dining_tables SET ?";
        connection.query(
          sql,
          {
            tbl_rest_id: rest_id,
            tbl_table_number: table.table_number,
            tbl_capacity: table.capacity
          },
          function (err, result) {
            if (err) return callback(err);
            table.tbl_id = result.insertId;
            callback(null, table);
          });
      });
    }
  }); // done set up tasks for each table

  // run task in series
  async.series(tasks, function (err, results) {
    if (err) throw err;
    return res.json(results);
  });
});

module.exports = router;