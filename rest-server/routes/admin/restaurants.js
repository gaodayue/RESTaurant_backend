// DANGEROUS, UNTESTED BAD CODE BELOW

var express = require('express'),
		router = express.Router(),
		iz = require('iz'),
    are = iz.are,
    validators = iz.validators,
    validationRules = require('../../utils/validation_rules'),
    util = require('../../utils/util'),
    db = require('../../utils/database'),
    connection = db.connection(),
    async = require('async');


router.get('/', function(req, res) {
	var query;
	async.waterfall([
		function(callback){
			var sql = 'SELECT rest_id, rest_name AS name, rest_address AS address, rest_geo_location AS geo_location, '+
								'rest_pic AS pic, ra_id AS mgr_id, ra_name AS mgr_name '+
								'FROM restaurants, restaurant_accounts '+
								'WHERE rest_owner_id = ra_id';
			query = connection.query(sql, function(err, result){
				if(err)
					callback('error');
				else {
					if(typeof result !== 'undefined' && result.length > 0){
						for(var i in result){
							result[i].geo_location.longitude = result[i].geo_location.x;
							delete result[i].geo_location.x;
							result[i].geo_location.latitude = result[i].geo_location.y;
							delete result[i].geo_location.y;
						}
						callback(null, result);
					}
					else
						callback('not exist');
				}
			});
		}
	], function(err, result){
			if(err){
				if(err === 'not exist')
					res.json(400, util.showError('no restaurants!'));
				else
					res.json(400, util.showError('unexpected error'));
			}
			else
				res.json(200, result);
	});
});

router.post('/create', function(req, res, next) {
	var query;
	var restaurant = req.body;
	var post = {
		'r_name' : restaurant.r_name,
		'r_addr' : restaurant.r_addr,
		'r_longitude' : restaurant.r_longitude,
		'r_latitude' : restaurant.r_latitude,
		'r_pic' : restaurant.r_pic,
		'r_mgr_name' : restaurant.r_mgr_name, // this is to create restaurant_account
		'r_mgr_pwd' : restaurant.r_mgr_pwd // this is to create restaurant_account
	};
	// validate input first
	var rules = are(validationRules.restaurants_rules);
	if (!rules.validFor(post)) {
    var invalidFields = rules.getInvalidFields();
    var errorMessage = invalidFields[Object.keys(invalidFields)[0]][0]; // only need to retrieve the last error
    res.json(400, util.showError(errorMessage));
	}
	else {
		async.waterfall([
			function(callback){
				var geo, pic, raId;
				// create RESTAURANT_ACCOUNT and then get the raId
				var ra = {
					'ra_name' : restaurant.r_mgr_name,
					'ra_password' : util.createHash(restaurant.r_mgr_pwd)
				};
				query = connection.query('INSERT INTO restaurant_accounts SET ?', ra, function(err, result) {
					if (err)
						callback('error');
					else {
						callback(null, result.insertId);
					}
				});
			},
			function(arg1, callback){
				if (restaurant.r_longitude && restaurant.r_latitude)
					geo = 'GeomFromText("POINT('+restaurant.r_longitude+' '+restaurant.r_latitude+')")';
				else
					geo = null;
				pic = restaurant.r_pic ? restaurant.r_pic : null;
				var data = {
					//'rest_id' : 1,
					'rest_owner_id' : arg1,
					'rest_name' : post.r_name,
					'rest_address' : post.r_addr,
					//'rest_geo_location' : geo,
					'rest_pic' : pic
				};
				// insert to database
				query = connection.query('INSERT INTO restaurants SET rest_geo_location = GeomFromText(?), ?', ['POINT('+restaurant.r_longitude+' '+restaurant.r_latitude+')',data], function(err, result) {
					if (err)
						callback('error');
					else
						callback(null, data);
				});
			}
		], function(err, result){
			if(err){
				if(err === 'error')
					res.json(400, 'unexpected error');
				else
					res.json(400, err);
			}
			else
				res.json(200, 'ok')
		});
	}
});

router.post('/update/:RESTID', function(req, res) {
	var restaurant = req.body;
	var restaurantId = req.params.RESTID;

	async.series([
		function(callback) {
			var result;
			var query = connection.query('SELECT rest_id FROM restaurants WHERE rest_id = ?', restaurantId, function(err, row){
				if(err)
					callback('error');
				else {
					if (typeof row !== 'undefined' && row.length > 0)
				  	result = true; // the array is defined and has at least one element
					else
						result = false;
				}
				if(result)
					callback(null, result);
				else
					callback('not exist');
			});
		},
		function(callback) {
			var post = {
				'r_name' : restaurant.r_name,
				'r_addr' : restaurant.r_addr,
				'r_longitude' : restaurant.r_longitude,
				'r_latitude' : restaurant.r_latitude,
				'r_pic' : restaurant.r_pic,
				'r_mgr_name' : restaurant.r_mgr_name,
				'r_mgr_pwd' : restaurant.r_mgr_pwd
			};
			// validate input first
			var rules = are(validationRules.restaurants_rules);
			if (!rules.validFor(post)) {
		    var invalidFields = rules.getInvalidFields();
		    var errorMessage = invalidFields[Object.keys(invalidFields)[0]][0]; // only need to retrieve the last error
		    res.json(400, util.showError(errorMessage));
			}
			else {
				var geo, pic;
				if (restaurant.r_longitude && restaurant.r_latitude)
					geo = 'GeomFromText("POINT('+restaurant.r_longitude+' '+restaurant.r_latitude+')")';
				else
					geo=null;
				pic = restaurant.r_pic ? restaurant.r_pic : null;
				var data = {
					'rest_id' : 1,
					'rest_owner_id' : 1,
					'rest_name' : post.r_name,
					'rest_address' : post.r_addr,
					//'rest_geo_location' : geo,
					'rest_pic' : pic
				};
				// update to database
				var query = connection.query('UPDATE restaurants SET rest_geo_location = GeomFromText(?), ? WHERE rest_id = ?', ['POINT('+restaurant.r_longitude+' '+restaurant.r_latitude+')',data, restaurantId], function(err, result) {
					if (err) {
						callback('error');
					}
					else {
						callback(null, 'ok');
					}
				});
			}
		}
	], function(err, result){
			if(err){
				if (err == 'not exist')
					res.json(400, util.showError('Restaurant does not exist'));
				else 
					res.json(400, util.showError('unexpected error'));
			}
			else {
				res.send(200, 'ok'); // TODO : we can change to json-formatted success
			}
	});
});

module.exports = router;
