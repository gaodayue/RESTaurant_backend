var express = require('express');
var router = express.Router();
var async = require('async');

var util = require('../utils/util');
var db = require('../utils/database');
var connection = db.connection();

router.get('/login', function (req, res) {
  if (req.session.manager) {
    return res.redirect('/');
  }

  if (req.query.tip == 'error') {
    var tip = 'username or password incorrect!';
  } else {
    var tip = null;
  }
  res.render('login', { tip: tip });
});

router.post('/login', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var sql = 'SELECT * FROM restaurant_accounts WHERE ra_name=?';
  connection.query(sql, [username], function (err, result) {
    if (err) throw err;
    if (result.length == 0) {
      return res.redirect('/manager/login?tip=error');
    } 
    var account = result[0];
    if (!util.checkHash(password, account.ra_password)) {
      return res.redirect('/manager/login?tip=error');
    }

    connection.query('SELECT * FROM restaurants WHERE rest_owner_id=?', [account.ra_id], function (err, result) {
      if (err) throw err;
      var restaurant = result[0];
      req.session.manager = {
        id: account.ra_id,
        name: account.ra_name,
        rest_id: restaurant.rest_id,
        rest_name: restaurant.rest_name
      };
      res.redirect('/');
    });
  });
});

router.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect('/manager/login');
});

module.exports = router;