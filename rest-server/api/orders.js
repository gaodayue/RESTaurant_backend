var express = require('express'),
    router = express.Router(),
    iz = require('iz'),
    are = iz.are,
    validators = iz.validators,
    validationRules = require('../utils/validation_rules'),
    util = require('../utils/util'),
    async = require('async');

var OrderDAO = require('../model/Order');


router.get('/', function (req, res) {
  if (!req.session.manager) {
    return res.json(401, util.showError('please login first'));
  }
  var rest_id = req.session.manager.rest_id;

  if (!req.query.types)
    return res.json(400, util.showError('require "types" param'));

  OrderDAO.getOrders(
    rest_id,
    req.query.types == 'pending',
    req.query.since,
    req.query.until,
    function (err, orders) {
      if (err) throw err;
      res.json(200, orders);
    }
  );
});


router.post('/accept/:OID', function(req, res) {
  var orderId = req.params.OID;
  // TODO insert schedule


  // var restaurantId = req.body.rest_id;
  // if(!restaurantId)
  //   res.json(400, util.showError('missing restaurant ID'));
  // else if(!orderId)
  //   res.json(400, util.showError('missing order ID'));
  // else {
  //   async.waterfall([
  //     function(callback){
  //       // TODO : determine the right status for this
  //       query = connection.query('UPDATE orders SET o_status = 3 WHERE o_id = ? AND o_rest_id = ?', [orderId, restaurantId], function(err, result){
  //         if(err)
  //           callback('error');
  //         else {
  //           callback(null, 'ok');
  //         }
  //       });
  //     }
  //   ], function(err, result){
  //       if(err){
  //         if(err === 'error')
  //           res.json(400, util.showError('unexpected error'));
  //         else
  //           res.json(400, util.showError(err));
  //       }
  //       else {
  //         if (result === 'ok') // just to make sure
  //           res.json(200, 'ok');
  //       }
  //   });
  // }
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