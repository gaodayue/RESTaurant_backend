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

router.get('/', function(req, res) {
  res.send('TO BE IMPLEMENTED');
});

router.get('/:INVID', function(req, res) {
	var invitationId = req.params.INVID;
  res.send('TO BE IMPLEMENTED');
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
		/*function(arg1, callback){
			// retrieve restaurant
			query = connection.query('SELECT * FROM restaurants WHERE rest_id = ? LIMIT 1', invitation.restaurant_id, function(err, result){
				if(err)
					callback('error');
				else{
					if (typeof result !== 'undefined' && result.length > 0){
						var data = {
							'rest_id' : result[0].rest_id,
							'name' : result[0].rest_name,
							'address' : result[0].rest_address,
							'geo_location' : {
								'longitude' : result[0].rest_geo_location.x,
								'latitude' : result[0].rest_geo_location.y
							},
							'pic' : result[0].rest_pic
						};
						callback(null, data);
					}
				}
			});
		},*/
		function(arg1, callback){ 
			// TODO : CREATE ORDER HERE!
			console.log('create order');
			var insert = {
				'o_rest_id' : invitation.restaurant_id,
				'o_cust_id' : 1, // TODO : the host ID
				'o_cust_phoneno' : 1, // TODO : the host phonenumber
				'o_totalprice' : 1, // TODO : calculate the total price
				'o_num_people' : invitation.customer_ids.length,
				'o_request_date' : invitation.request_date,
				'o_request_period' : invitation.request_period,
				'o_schedule_info' : '', // TODO : What to fill?
				'o_status' : 1 // TODO : What to fill? (Default when create is 1?)
			};
			query = connection.query('INSERT INTO orders SET ?', insert, function(err, result){
				if(err)
					callback('error');
				else{
					callback(null, result.insertId);
				}
			});
			//callback(null, 'order');
		},
		function(arg1, callback){ //arg1:order_id
			query = connection.query('SELECT * FROM orders WHERE o_id = ?', arg1, function(err, result){
				if(err)
					callback('error');
				else{
					if(typeof result !== 'undefined' && result.length > 0){
						var data = {
							'o_id' : result[0].insertId,
							'restaurant' : arg1,
							'customer' : '', // TODO : What to fill?
							'dishes' : invitation.dishes,
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
		function(arg1, callback){ // arg1 : order
			console.log('create order item');
			callback(null, 'order', 'order_item');
			// TODO : CREATE ORDER ITEMS HERE!
		},
		function(arg1, arg2, arg3, callback){ // arg1:order, arg2:order_item
			// Get the latest invitation id 
			console.log('get latest invitation id');
			query = connection.query('SELECT inv_id FROM invitations ORDER BY inv_created_time LIMIT 1', function(err, result){
				if(err)
					callback('error');
				else
					callback(null, arg1, arg2, (result[0].inv_id)+1);
			});
		},
		function(arg1, arg2, arg3, callback){ // arg1:order, arg2:order_item, arg3:last_invitation_id
			var data = [];

			for(var i in invitation.customer_ids){ // creating array for bulk insert
				/*var a = {
					'inv_cust_id' : invitation.customer_ids[i],
					'inv_order_id' : '',//post.?,
					'inv_is_host' : '',//post.?,
					'inv_status' : 1 // default is 1:planning
				};*/
				var a = [arg3, invitation.customer_ids[i], arg2.o_id, true, 1]; // prototype
				data.push(a);
			}

			// insert to database
			query = connection.query('INSERT INTO invitations (inv_id, inv_cust_id, inv_order_id, inv_is_host, inv_status) VALUES ?', [data], function(err, result) {
				if (err){
					console.log(err);
					callback('error');
				}
				else
					callback(null, 'ok');
				console.log(query.sql);
			});
			//console.log('invitation : ' + JSON.stringify(data));
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
			if(result === 'ok') // make sure everything came from waterfall
				res.json(200, 'ok');
	});
});

router.post('/accept/:INVID', function(req, res) {
	var invitationId = req.params.INVID;
  res.send('TO BE IMPLEMENTED');
});

router.post('/deny/:INVID', function(req, res) {
	var invitationId = req.params.INVID;
  res.send('TO BE IMPLEMENTED');
});

module.exports = router;