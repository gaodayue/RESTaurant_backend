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

router.post('/', function(req, res) {
	var query;
	var since = req.body.start_date;
	var until = req.body.end_date;
	var restaurantId = req.body.rest_id;
	if(!restaurantId)
		res.json(400, util.showError('missing restaurant ID'));
	else {
		async.waterfall([
			function(callback){
				var sql = 'SELECT o_rest_id, cust_id, '
							+'cust_name, o_id, o_totalprice, o_num_people, o_request_date, o_request_period, '
							+'o_schedule_info, o_status, o_created_time, o_updated_time '
							+'FROM orders, customer_accounts '
							+'WHERE o_cust_id = cust_id AND o_rest_id = ? AND (o_created_time BETWEEN ? AND ?)';
				query = connection.query(sql, [restaurantId, since, until], function(err, result){
					if(err)
						callback('error');
					else{
						if(typeof result !== 'undefined' && result.length > 0){
							var order = [];
							for(var i in result){
								var o = {
									'o_id' : result[i].o_id,
									'restaurant' : {
										'rest_id' : result[i].o_rest_id
									},
									'customer' : {
										'cust_id' : result[i].cust_id,
										'name' : result[i].cust_name
									},
									'dishes' : [],
									'total_price' : result[i].o_totalprice,
									'num_people' : result[i].o_num_people,
									'request_date' : result[i].o_request_date,
									'request_period' : result[i].o_request_period,
									'schedule_info' : result[i].o_schedule_info,
									'status': result[i].o_status,
									'created_time' : result[i].o_created_time,
									'updated_time' : result[i].o_updated_time
								};
								order.push(o);
							}
							callback(null, order);
						}
						else
							callback('not exist');
					}
				});
			},
			function(arg1, callback){
				// TODO : How to get all dishes for each order ?
				// do we need to do select for each o_id ?
				/*var sql = 'SELECT oitem_name, oitem_price, oitem_quantity FROM order_items WHERE oitem_order_id = ?';
				query = connection.query(sql, JSON.stringify(arg1.o_id), function(err, result){
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
							arg1.dishes.push(data);
						}
						callback(null, arg1);
					}
				});*/
				callback(null, 'pass by');
			}
		], function(err, result){
				if(err){
					if(err === 'error')
						res.json(400, util.showError('unexpected error'));
					else
						res.json(400, util.showError(err));
				}
				else {
					res.json(200, result);
				}
		});	
	}
});

router.post('/accept/:OID', function(req, res) {
	var query;
	var orderId = req.params.OID;
	var restaurantId = req.body.rest_id;
	if(!restaurantId)
		res.json(400, util.showError('missing restaurant ID'));
	else {
		async.waterfall([
			function(callback){
				// TODO : determine the right status for this
				query = connection.query('UPDATE orders SET o_status = 3 WHERE o_id = ? AND o_rest_id = ?', [orderId, restaurantId], function(err, result){
					if(err)
						callback('error');
					else {
						callback(null, 'ok');
					}
				});
			}
		], function(err, result){
				if(err){
					if(err === 'error')
						res.json(400, util.showError('unexpected error'));
					else
						res.json(400, util.showError(err));
				}
				else {
					if (result === 'ok') // just to make sure
						res.json(200, 'ok');
				}
		});
	}
});

router.post('/deny/:OID', function(req, res) {
	var query;
	var orderId = req.params.OID;
	var restaurantId = req.body.rest_id;
	if(!restaurantId)
		res.json(400, util.showError('missing restaurant ID'));
	else {
		async.waterfall([
			function(callback){
				// TODO : determine the right status for this
				query = connection.query('UPDATE orders SET o_status = 5 WHERE o_id = ? AND o_rest_id = ?', [orderId, restaurantId], function(err, result){
					if(err)
						callback('error');
					else {
						callback(null, 'ok');
					}
				});
			}
		], function(err, result){
				if(err){
					if(err === 'error')
						res.json(400, util.showError('unexpected error'));
					else
						res.json(400, util.showError(err));
				}
				else {
					if (result === 'ok') // just to make sure
						res.json(200, 'ok');
				}
		});
	}
});

router.post('/consume/:OID', function(req, res) {
	var query;
	var orderId = req.params.OID;
	var restaurantId = req.body.rest_id;
	if(!restaurantId)
		res.json(400, util.showError('missing restaurant ID'));
	else {
		async.waterfall([
			function(callback){
				// TODO : determine the right status for this
				query = connection.query('UPDATE orders SET o_status = 7 WHERE o_id = ? AND o_rest_id = ?', [orderId, restaurantId], function(err, result){
					if(err)
						callback('error');
					else {
						callback(null, 'ok');
					}
				});
			}
		], function(err, result){
				if(err){
					if(err === 'error')
						res.json(400, util.showError('unexpected error'));
					else
						res.json(400, util.showError(err));
				}
				else {
					if (result === 'ok') // just to make sure
						res.json(200, 'ok');
				}
		});
	}
});

module.exports = router;