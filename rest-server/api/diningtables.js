var express = require('express'),
    router = express.Router(),
    util = require('../utils/util'),
    db = require('../utils/database'),
    connection = db.connection(),
    async = require('async'),
    _ = require('underscore');

// return list of tables
router.get('/', function (req, res) {
  if (!req.session.manager) {
    return res.json(401, util.showError('please login first'));
  }
  var rest_id = req.session.manager.rest_id;
  var sql = 'SELECT tbl_id, tbl_display_number as display_number, tbl_capacity as capacity ' +
            'FROM dining_tables WHERE tbl_rest_id=? ORDER BY tbl_display_number';
  connection.query(sql, [rest_id], function (err, result) {
    if (err) throw err;
    return res.json(result);
  });
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
                  'SET tbl_display_number=?, tbl_capacity=? WHERE tbl_id=?';
        connection.query(sql, [table.display_number, table.capacity, table.tbl_id], function (err, result) {
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
            tbl_display_number: table.display_number,
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