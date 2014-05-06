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
  var custId = req.body.cust_id;
  if(!custId)
  	res.json(400, util.showError('missing customer ID'));
  else {
  	async.waterfall([
			function(callback){
				// GET INVITATION
				query = connection.query('SELECT * FROM invitations WHERE inv_cust_id = ?',custId, function(err, result){
					if(err)
						callback('error');
					else {
						if(typeof result !== 'undefined' && result.length > 0){
							callback(null, result);
						}
					}
				});
			}
		], function(err, result){
				if(err){
					if(err === 'error')
						res.json(400, util.showError('unexpected error'));
					else
						res.json(400, err);
				}
				else
					res.json(200, result);
		});
  }
});

router.post('/:INVID', function(req, res) {
	var query;
	var invitationId = req.params.INVID;
	var custId = req.body.cust_id;
	if(!custId)
  	res.json(400, util.showError('missing customer ID'));
  else {
  	async.waterfall([
			function(callback){
				var sql = 'SELECT cust_id, cust_name, inv_order_id, inv_is_host, inv_created_time, inv_status '
								+'FROM invitations, customer_accounts WHERE inv_cust_id = cust_id and inv_id = ?';
				query = connection.query(sql, invitationId, function(err, result){
					if(err)
						callback('error');
					else {
						if(typeof result !== 'undefined' && result.length > 0){
							var data = {
								'inv_id' : invitationId,
								'created_time' : result[0].inv_created_time,
								'participants' : []
							};
							for(var i in result){
								var participant = {
									'cust_id' : result[i].cust_id,
									'cust_name' : result[i].cust_name
								};
								if(result[i].inv_is_host)
									participant.is_host = result[i].inv_is_host;
								else
									participant.inv_status = result[i].inv_status;
								data.participants.push(participant);
							}
							callback(null, data, result[0].inv_order_id);
						}
						else
							callback('not exist');
					}
				});
			},
			function(arg1, arg2, callback){
				var sql = 'SELECT rest_id, rest_name, rest_address, rest_geo_location, rest_pic, cust_id, '
							+'cust_name, o_id, o_totalprice, o_num_people, o_request_date, o_request_period, '
							+'o_schedule_info, o_status, o_created_time, o_updated_time '
							+'FROM orders, restaurants, customer_accounts '
							+'WHERE o_rest_id = rest_id and o_cust_id = cust_id and o_id = ?';
				query = connection.query(sql, arg2, function(err, result){
					if(err)
						callback('error');
					else{
						if(typeof result !== 'undefined' && result.length > 0){
							var order = {
								'o_id' : result[0].o_id,
								'restaurant' : {
									'rest_id' : result[0].rest_id,
									'name' : result[0].rest_name,
									'address' : result[0].rest_address,
									'geo_location' : {
										'longitude' : result[0].rest_geo_location.x,
										'latitude' : result[0].rest_geo_location.y
									},
									'pic' : result[0].rest_pic,
								},
								'customer' : {
									'cust_id' : result[0].cust_id,
									'name' : result[0].cust_name
								},
								'dishes' : [],
								'total_price' : result[0].o_totalprice,
								'num_people' : result[0].o_num_people,
								'request_date' : result[0].o_request_date,
								'request_period' : result[0].o_request_period,
								'schedule_info' : result[0].o_schedule_info,
								'status': result[0].o_status,
								'created_time' : result[0].o_created_time,
								'updated_time' : result[0].o_updated_time
							};
							arg1.order = order;
							callback(null, arg1);
						}
						else
							callback('not exist');
					}
				});
			},
			function(arg1, callback){ 
			// Get the Dishes from order_items
			var sql = 'SELECT oitem_name, oitem_price, oitem_quantity FROM order_items WHERE oitem_order_id = ?';
			query = connection.query(sql, JSON.stringify(arg1.order.o_id), function(err, result){
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
						arg1.order.dishes.push(data);
					}
					callback(null, arg1);
				}
			});
		},
		], function(err, result){
			if(err){
				if(err === 'error')
					res.json(400, util.showError('unexpected error'));
				else if(err === 'not exist')
					res.json(400, util.showError('not exist'));
				else
					res.json(400, util.showError(err))
			}
			else {
				res.json(200, result);
			}
		});
  }
});

router.post('/create', function(req, res) {
  var invitation = req.body;
  var data;
	// validate input first
	async.waterfall([
		function(callback){
			var errorMessage;
			var rules = are(validationRules.invitations_rules);
			if (!rules.validFor(invitation)) {
		    var invalidFields = rules.getInvalidFields();
		    var errorMessage = invalidFields[Object.keys(invalidFields)[0]][0]; // only need to retrieve the last error
		    callback(errorMessage);
		    //res.json(400, util.showError(errorMessage));
			}
			else {
				for(var i in invitation.dishes){
					rules = are(validationRules.invitation_dishes_rules);
					if (!rules.validFor(invitation.dishes[i])) {
						var invalidFields = rules.getInvalidFields();
				    var errorMessage = invalidFields[Object.keys(invalidFields)[0]][0]; // only need to retrieve the last error
				    callback(errorMessage);
				    //res.json(400, util.showError(errorMessage));
					}
				}
			}
			if(!errorMessage)
				callback(null, 'ok');
		},
		function(arg1, callback){ 
			// CREATE ORDER HERE!
			var totalPrice = 0;
			for(var i in invitation.dishes){
				totalPrice += (invitation.dishes[i].price * invitation.dishes[i].quantity);
			}
			var insert = {
				'o_rest_id' : invitation.restaurant_id,
				'o_cust_id' : 1, // TODO : the host ID
				'o_cust_phoneno' : 1, // TODO : the host phonenumber
				'o_totalprice' : totalPrice, // TODO : calculate the total price
				'o_num_people' : invitation.customer_ids.length,
				'o_request_date' : invitation.request_date,
				'o_request_period' : invitation.request_period,
				'o_schedule_info' : '', // TODO : What to fill?
				'o_status' : 1 // TODO : What to fill? (Default when create is 1?)
			};
			query = connection.query('INSERT INTO orders SET ?', insert, function(err, result){
				if(err){
					console.log(err);
					callback('error');
				}
				else{
					callback(null, result.insertId);
				}
			});
		},
		function(arg1, callback){ //arg1:order_id
			// GET ORDER
			var sql = 'SELECT rest_id, rest_name, rest_address, rest_geo_location, rest_pic, cust_id, '
							+'cust_name, o_id, o_totalprice, o_num_people, o_request_date, o_request_period, '
							+'o_schedule_info, o_status, o_created_time, o_updated_time '
							+'FROM orders, restaurants, customer_accounts '
							+'WHERE o_rest_id = rest_id and o_cust_id = cust_id and o_id = ?';
			query = connection.query(sql, arg1, function(err, result){
				if(err){
					console.log(err);
					callback('error');
				}
				else{
					console.log(arg1);
					if(typeof result !== 'undefined' && result.length > 0){
						var data = {
							'o_id' : result[0].o_id,
							'restaurant' : {
								'rest_id' : result[0].rest_id,
								'name' : result[0].rest_name,
								'address' : result[0].rest_address,
								'geo_location' : {
									'longitude' : result[0].rest_geo_location.x,
									'latitude' : result[0].rest_geo_location.y
								},
								'pic' : result[0].rest_pic,
							},
							'customer' : {
								'cust_id' : result[0].cust_id,
								'name' : result[0].cust_name
							},
							'dishes' : [],
							'total_price' : result[0].o_totalprice,
							'num_people' : result[0].o_num_people,
							'request_date' : result[0].o_request_date,
							'request_period' : result[0].o_request_period,
							'schedule_info' : result[0].o_schedule_info,
							'status': result[0].o_status,
							'created_time' : result[0].o_created_time,
							'updated_time' : result[0].o_updated_time
						};
						callback(null, data);
					}
				}
			});
		},
		function(arg1, callback){ // arg1 : order (without dishes yet)
			// CREATE ORDER ITEM (DISHES)
			var data = [];
			for (var i in invitation.dishes){ // creating array for bulk insert
				// oitem_order_id, oitem_name, oitem_price, oitem_quantity
				var a = [arg1.o_id, invitation.dishes[i].name, invitation.dishes[i].price, invitation.dishes[i].quantity];
				data.push(a);
			}
			query = connection.query('INSERT INTO order_items (oitem_order_id, oitem_name, oitem_price, oitem_quantity) VALUES ?', [data], function(err, result){
				if(err)
					callback('error');
				else{
					callback(null, arg1);
				}
			});
		},
		function(arg1, callback){ // arg1:order
			// Get the Dishes from order_items
			var sql = 'SELECT oitem_name, oitem_price, oitem_quantity FROM order_items WHERE oitem_order_id = ?';
			query = connection.query(sql, arg1.o_id, function(err, result){
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
			});
		},
		function(arg1, callback){ // arg1:order (with dishes)
			// Get the latest invitation id
			// we have to retrieve manually and increment it by one
			// because inv_id is not unique and can be duplicated in the table (??)
			console.log('get latest invitation id');
			query = connection.query('SELECT inv_id FROM invitations ORDER BY inv_created_time DESC LIMIT 1', function(err, result){
				if(err)
					callback('error');
				else
					callback(null, arg1, (result[0].inv_id)+1);
			});
		},
		function(arg1, arg2, callback){ // arg1:order, arg2:last_invitation_id
			// CREATE INVITATION
			var data = [];
			for(var i in invitation.customer_ids){ // creating array for bulk insert
				// inv_id, inv_cust_id, inv_order_id, inv_is_host, inv_status
				var a = [arg2, invitation.customer_ids[i], arg1.o_id, true, 's']; // TODO : change is_host
				data.push(a);
			}
			// insert to database
			query = connection.query('INSERT INTO invitations (inv_id, inv_cust_id, inv_order_id, inv_is_host, inv_status) VALUES ?', [data], function(err, result) {
				if (err)
					callback('error');
				else
					callback(null, arg1, arg2);
			});
		},
		function(arg1, arg2, callback){ // arg1:order, arg2:invitation_id
			// GET INVITATION AND CONSTRUCT FINAL RETURN JSON
			var sql = 'SELECT cust_id, cust_name, inv_order_id, inv_is_host, inv_created_time, inv_status '
								+'FROM invitations, customer_accounts WHERE inv_cust_id = cust_id and inv_id = ?';
			query = connection.query(sql, arg2, function(err, result){
				if(err)
					callback('error');
				else{
					if(typeof result !== 'undefined' && result.length > 0){
						var data = {
							'inv_id' : arg2,
							'created_time' : result[0].inv_created_time,
							'participants' : [],
							'order' : arg1
						};
						for(var i in result){
							var participant = {
								'cust_id' : result[i].cust_id,
								'cust_name' : result[i].cust_name
							};
							if(result[i].inv_is_host)
								participant.is_host = result[i].inv_is_host;
							else
								participant.inv_status = result[i].inv_status;
							data.participants.push(participant);
						}
						callback(null, data);
					}
				}
			});
		}
	], function(err, result){
		if(err){
			if(err === 'error'){
				res.json(400, util.showError('unexpected error'));
			}
			else { // expecting error from invalid fields
				res.json(400, util.showError(err));
			}
		}
		else
			res.json(200, result);
	});
});

router.post('/accept/:INVID', function(req, res) {
	var query;
	var invitationId = req.params.INVID;
	var custId = req.body.cust_id;
	if(!custId)
  	res.json(400, util.showError('missing customer ID'));
  else {
  	async.waterfall([
  		function(callback){
  			// update inv_status
  			query = connection.query('UPDATE invitations SET inv_status = "a" WHERE inv_id = ? AND inv_cust_id = ?', [invitationId, custId], function(err, result){
  				if(err)
  					callback('error');
  				else{
  					callback(null, 'ok');
  				}
  			});
  		},
			function(arg1, callback){
				var sql = 'SELECT cust_id, cust_name, inv_order_id, inv_is_host, inv_created_time, inv_status '
								+'FROM invitations, customer_accounts WHERE inv_cust_id = cust_id and inv_id = ?';
				query = connection.query(sql, invitationId, function(err, result){
					if(err)
						callback('error');
					else {
						if(typeof result !== 'undefined' && result.length > 0){
							var data = {
								'inv_id' : invitationId,
								'created_time' : result[0].inv_created_time,
								'participants' : []
							};
							for(var i in result){
								var participant = {
									'cust_id' : result[i].cust_id,
									'cust_name' : result[i].cust_name
								};
								if(result[i].inv_is_host)
									participant.is_host = result[i].inv_is_host;
								else
									participant.inv_status = result[i].inv_status;
								data.participants.push(participant);
							}
							callback(null, data, result[0].inv_order_id);
						}
						else
							callback('not exist');
					}
				});
			},
			function(arg1, arg2, callback){
				var sql = 'SELECT rest_id, rest_name, rest_address, rest_geo_location, rest_pic, cust_id, '
							+'cust_name, o_id, o_totalprice, o_num_people, o_request_date, o_request_period, '
							+'o_schedule_info, o_status, o_created_time, o_updated_time '
							+'FROM orders, restaurants, customer_accounts '
							+'WHERE o_rest_id = rest_id and o_cust_id = cust_id and o_id = ?';
				query = connection.query(sql, arg2, function(err, result){
					if(err)
						callback('error');
					else{
						if(typeof result !== 'undefined' && result.length > 0){
							var order = {
								'o_id' : result[0].o_id,
								'restaurant' : {
									'rest_id' : result[0].rest_id,
									'name' : result[0].rest_name,
									'address' : result[0].rest_address,
									'geo_location' : {
										'longitude' : result[0].rest_geo_location.x,
										'latitude' : result[0].rest_geo_location.y
									},
									'pic' : result[0].rest_pic,
								},
								'customer' : {
									'cust_id' : result[0].cust_id,
									'name' : result[0].cust_name
								},
								'dishes' : [],
								'total_price' : result[0].o_totalprice,
								'num_people' : result[0].o_num_people,
								'request_date' : result[0].o_request_date,
								'request_period' : result[0].o_request_period,
								'schedule_info' : result[0].o_schedule_info,
								'status': result[0].o_status,
								'created_time' : result[0].o_created_time,
								'updated_time' : result[0].o_updated_time
							};
							arg1.order = order;
							callback(null, arg1);
						}
						else
							callback('not exist');
					}
				});
			},
			function(arg1, callback){ 
			// Get the Dishes from order_items
			var sql = 'SELECT oitem_name, oitem_price, oitem_quantity FROM order_items WHERE oitem_order_id = ?';
			query = connection.query(sql, JSON.stringify(arg1.order.o_id), function(err, result){
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
						arg1.order.dishes.push(data);
					}
					callback(null, arg1);
				}
			});
		},
		], function(err, result){
			if(err){
				if(err === 'error')
					res.json(400, util.showError('unexpected error'));
				else if(err === 'not exist')
					res.json(400, util.showError('not exist'));
				else
					res.json(400, util.showError(err))
			}
			else {
				res.json(200, result);
			}
		});
  }
});

router.post('/deny/:INVID', function(req, res) {
	var query;
	var invitationId = req.params.INVID;
	var custId = req.body.cust_id;
	if(!custId)
  	res.json(400, util.showError('missing customer ID'));
  else {
  	async.waterfall([
  		function(callback){
  			// update inv_status
  			query = connection.query('UPDATE invitations SET inv_status = "d" WHERE inv_id = ? AND inv_cust_id = ?', [invitationId, custId], function(err, result){
  				if(err)
  					callback('error');
  				else{
  					callback(null, 'ok');
  				}
  			});
  		},
			function(arg1, callback){
				var sql = 'SELECT cust_id, cust_name, inv_order_id, inv_is_host, inv_created_time, inv_status '
								+'FROM invitations, customer_accounts WHERE inv_cust_id = cust_id and inv_id = ?';
				query = connection.query(sql, invitationId, function(err, result){
					if(err)
						callback('error');
					else {
						if(typeof result !== 'undefined' && result.length > 0){
							var data = {
								'inv_id' : invitationId,
								'created_time' : result[0].inv_created_time,
								'participants' : []
							};
							for(var i in result){
								var participant = {
									'cust_id' : result[i].cust_id,
									'cust_name' : result[i].cust_name
								};
								if(result[i].inv_is_host)
									participant.is_host = result[i].inv_is_host;
								else
									participant.inv_status = result[i].inv_status;
								data.participants.push(participant);
							}
							callback(null, data, result[0].inv_order_id);
						}
						else
							callback('not exist');
					}
				});
			},
			function(arg1, arg2, callback){
				var sql = 'SELECT rest_id, rest_name, rest_address, rest_geo_location, rest_pic, cust_id, '
							+'cust_name, o_id, o_totalprice, o_num_people, o_request_date, o_request_period, '
							+'o_schedule_info, o_status, o_created_time, o_updated_time '
							+'FROM orders, restaurants, customer_accounts '
							+'WHERE o_rest_id = rest_id and o_cust_id = cust_id and o_id = ?';
				query = connection.query(sql, arg2, function(err, result){
					if(err)
						callback('error');
					else{
						if(typeof result !== 'undefined' && result.length > 0){
							var order = {
								'o_id' : result[0].o_id,
								'restaurant' : {
									'rest_id' : result[0].rest_id,
									'name' : result[0].rest_name,
									'address' : result[0].rest_address,
									'geo_location' : {
										'longitude' : result[0].rest_geo_location.x,
										'latitude' : result[0].rest_geo_location.y
									},
									'pic' : result[0].rest_pic,
								},
								'customer' : {
									'cust_id' : result[0].cust_id,
									'name' : result[0].cust_name
								},
								'dishes' : [],
								'total_price' : result[0].o_totalprice,
								'num_people' : result[0].o_num_people,
								'request_date' : result[0].o_request_date,
								'request_period' : result[0].o_request_period,
								'schedule_info' : result[0].o_schedule_info,
								'status': result[0].o_status,
								'created_time' : result[0].o_created_time,
								'updated_time' : result[0].o_updated_time
							};
							arg1.order = order;
							callback(null, arg1);
						}
						else
							callback('not exist');
					}
				});
			},
			function(arg1, callback){ 
			// Get the Dishes from order_items
			var sql = 'SELECT oitem_name, oitem_price, oitem_quantity FROM order_items WHERE oitem_order_id = ?';
			query = connection.query(sql, JSON.stringify(arg1.order.o_id), function(err, result){
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
						arg1.order.dishes.push(data);
					}
					callback(null, arg1);
				}
			});
		},
		], function(err, result){
			if(err){
				if(err === 'error')
					res.json(400, util.showError('unexpected error'));
				else if(err === 'not exist')
					res.json(400, util.showError('not exist'));
				else
					res.json(400, util.showError(err))
			}
			else {
				res.json(200, result);
			}
		});
  }
});

module.exports = router;