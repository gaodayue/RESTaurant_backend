var express = require('express');
var router = express.Router();
var db = require('../utils/database');
var connection = db.connection();
var util = require('../utils/util');
var dateformat = require('dateformat');
var _ = require('underscore');

// list all coupons
router.get('/', function (req, res) {
  if (!req.session.manager) {
    return res.redirect('/manager/login');
  }
  //var restId = req.session.manager.rest_id;
  connection.query("select * from coupons where c_rest_id = ? order by c_id desc", req.session.manager.rest_id, function (err, coupons) {
      var error = null;
      if (err) {
        error = "error while reading coupons";
      }
      if (req.query.tip == 'error') 
          error = "error while adding coupon";
      res.render('coupon-list', { title: 'Coupons', coupons: coupons, error: error, dateformat: dateformat });
  });

  //coupons = [];
  
});

router.get('/create', function (req, res) {
  if (!req.session.manager) {
    return res.redirect('/manager/login');
  }
  res.render('coupon-add', { title: 'Add Coupons' });
  });

router.post('/edit', function (req, res) {
  if (!req.session.manager) {
    return res.redirect('/manager/login');
  }
  console.log(req);
  var coupon = {
    c_message: req.body.msg,
    c_title: req.body.title,
    c_start_date: req.body.start,
    c_end_date: req.body.end
  };
  connection.query("update coupons set ? where c_id = ?", [coupon, req.body.c_id], function (err, results) {
    if (err){
      console.error(err.stack || err);
      return res.json(401, util.showError('error'));
    }else{
      return res.json("ok");
    }
  });
});

router.post('/create', function (req, res) {
  console.log(req);
  var coupon = {
      c_title: req.body.title,
      c_message: req.body.message,
      c_start_date: req.body.start_time,
      c_end_date: req.body.end_time,
      c_rest_id: req.session.manager.rest_id
  };
  var error = "";
  connection.query("insert into coupons set ?" , coupon, function (err, results) {
      if (err) {
        console.error(err.stack || err);
        error = "error";
      }
      res.redirect('/coupons?tip='+error);
  });
});

router.post('/push/:CID', function (req, res) {
  if (!req.session.manager) {
    return res.redirect('/manager/login');
  }
  var couponId = req.params.CID;
  var restId = req.session.manager.rest_id;
  var restName = req.session.manager.rest_name;
  var couponTitle = req.body.coupon_title;

  var customerIds = [];
  var queryBody = {
    'messages': {
      'title': restName + ' just posted a coupon',
      'description': couponTitle,
      'custom_content': {
        'restaurant_id': restId,
        'type': 'coupon'
      }
    }
  };
  async.series([
    // send to all customers FIXME better to just send to target customers
    function (callback) {
      connection.query('SELECT cust_id FROM customer_accounts', function (err, results) {
        if (err) return callback(err);
        _.each(results, function (customer) {
          customerIds.push(customer.cust_id);
        });
        callback(null, 'ok');
      });
    },
    // send push!
    function (callback) {
      var totalPush = util.sendPush(queryBody, customerIds);
      callback(null, 'ok');
    }
  ], function (err, results) {
    if (err) return res.json(400, util.showError(err));
    res.json(200, 'ok');
  });
});

module.exports = router;