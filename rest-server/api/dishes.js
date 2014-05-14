var express = require('express'),
    router = express.Router(),
    util = require('../utils/util'),
    db = require('../utils/database'),
    connection = db.connection(),
    async = require('async'),
    _ = require('underscore');


router.get('/', function (req, res) {
  // get rest_id from session
  if (!req.session.manager) {
    return res.json(401, util.showError('please login first'));
  }
  var rest_id = req.session.manager.rest_id;
  var sql = 'SELECT d_id, d_name as name, d_price as price ' +
            'FROM dishes WHERE d_rest_id=? ORDER BY d_id';
  connection.query(sql, [rest_id], function (err, result) {
    if (err) throw err;
    return res.json(result);
  });
});


router.post('/', function (req, res) {
  // get rest_id from session
  if (!req.session.manager) {
    return res.json(401, util.showError('please login first'));
  }
  var rest_id = req.session.manager.rest_id;
  var new_dishes = req.body;
  // TODO input validation
  if (!new_dishes) {
    return res.json(400, util.showError('request body cannot be empty!'));
  }
  // TODO transaction!!!
  async.series([
    // 1. delete all dishes from specified restaurants
    function (callback) {
      connection.query('DELETE FROM dishes WHERE d_rest_id=?', [rest_id], function (err, result) {
        if (err) return callback(err);
        callback();
      });
    },
    // 2. insert new dishes
    function (callback) {
      var sql = 'INSERT INTO dishes (d_rest_id, d_name, d_price) VALUES ?';
      var data = _.map(new_dishes, function (dish) {
        return [rest_id, dish.name, dish.price];
      });
      connection.query(sql, [data], function (err, result) {
        if (err) return callback(err);
        callback();
      });
    }
  ],
  function (err, results) {
    if (err) throw err;
    res.send(200);
  });
});

module.exports = router;
