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

function getOrderById(order, id) {
  // filtering the device controller by id
  return order.filter(
    function(data){return data.o_id == id}
  );
}

function getOrderItemByOrderId(orderItem, id) {
  // filtering the device controller by id
  return orderItem.filter(
    function(data){return data.oitem_order_id == id}
  );
}

router.get('/', function(req, res) {
	var query;
	var since = req.param('start_date'); // TODO : validate this
	var until = req.param('end_date');	// TODO : validate this
	var restaurantId = req.param('r_id'); // TODO : validate this
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
							var orderIds = [];
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
								orderIds.push(result[i].o_id);
							}
							callback(null, order, orderIds);
						}
						else
							callback('not exist');
					}
				});
			},
			function(arg1, arg2, callback){ // arg1: array of order, arg2: array of order
				// TODO : How to get all dishes for each order ?
				// do we need to do select for each o_id ?
				var data = [];
				var sql = 'SELECT oitem_order_id, oitem_name AS name, oitem_price AS price, oitem_quantity AS quantity FROM order_items WHERE oitem_order_id IN (?) ORDER BY oitem_order_id';
				query = connection.query(sql, [arg2], function(err, result){
					if(err){
						console.log(query.sql);
						callback('error');
					}
					else{
						/*for(var i in result){
							var dish = {
								//'d_id' : ? 
								'name' : result[i].oitem_name,
								'price' : result[i].oitem_price,
								'quantity' : result[i].oitem_quantity
							};
							var order = getOrderById(arg1, result[i].oitem_order_id)[0];
							order.dishes.push(dish);
							data.push(order);
						} this wont show order that have no order items*/
						for(var i in arg1){
							var dishes = getOrderItemByOrderId(result, arg1[i].o_id); // the dish that has order id
							if (dishes.length > 0){
								for(var ii in dishes){
									delete dishes[ii].oitem_order_id;
								}
								arg1[i].dishes = dishes;	
							}
						}
						callback(null, arg1);
					}
				});
			}
		], function(err, result){
				if(err){
					if(err === 'error')
						res.json(400, util.showError('unexpected error'));
					else if(err === 'not exist')
						res.json(400, util.showError('no orders yet'));
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