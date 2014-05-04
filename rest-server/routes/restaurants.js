var express = require('express'),
		router = express.Router(),
		iz = require('iz'),
    are = iz.are,
    validators = iz.validators,
    validationRules = require('../utils/validation_rules'),
    util = require('../utils/util'),
    db = require('../utils/database'),
    connection = db.connection();

/* GET nearby restaurants. */
router.get('/nearby', function(req, res) {
  res.send('TO BE IMPLEMENTED');
});

router.get('/show/:RESTID', function(req, res) {
	var restaurantId = req.params.RESTID;
	var data;
	// check if the RESTID exist or not in database
	if (!db.isExisting('restaurants', 'rest_id', restaurantId))
		res.json(400, util.showError('Restaurant does not exist'));
	var query = connection.query('SELECT * FROM restaurants WHERE rest_id = ? LIMIT 1', restaurantId, function(err, result) {
		if (err)
			res.json(400, util.showError(err.message));
		else {
			data = {
				'rest_id' : result.rest_id,
				'name' : result.rest_name,
				'address' : result.rest_address,
				'geo_location' : {
					'longitude' : '',
					'latitude' : ''
				},
				'pic' : result.rest_pic,
				'dishes' : ''
			};
		}
	});
res.json(200, data);
});

router.post('/create', function(req, res) {
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
		var geo, pic, ra_id;
		// create RESTAURANT_ACCOUNT and then get the ra_id
		var ra = {
			'ra_name' : restaurant.r_mgr_name,
			'ra_password' : util.createHash(restaurant.r_mgr_pwd)
		};
		query = connection.query('INSERT INTO restaurant_account SET ?', ra, function(err, result) {
			if (err) 
				res.json(400, util.showError(err.message));
			ra_id = result.insertId;
		});
		if (restaurant.r_longitude && restaurant.r_latitude)
			geo = 'GeomFromText("POINT('+restaurant.r_longitude+' '+restaurant.r_latitude+')")';
		else
			geo = null;
		pic = restaurant.r_pic ? restaurant.r_pic : null;
		var data = {
			//'rest_id' : 1,
			'rest_owner_id' : ra_id,
			'rest_name' : post.r_name,
			'rest_address' : post.r_addr,
			//'rest_geo_location' : geo,
			'rest_pic' : pic
		};
		// insert to database
		query = connection.query('INSERT INTO restaurants SET rest_geo_location = GeomFromText(?), ?', ['POINT('+restaurant.r_longitude+' '+restaurant.r_latitude+')',data], function(err, result) {
			if (err)
				res.json(400, util.showError(err.message));
			else
				res.send(200, 'ok'); // TO DO : we can change to json-formatted success
		});
		//console.log('The query is : ' + query.sql);
		//connection.end(function(err) {
		  // The connection is terminated now
		//});
		
	}
});

router.post('/update/:RESTID', function(req, res) {
	var restaurant = req.body;
	var restaurantId = req.params.RESTID;

	// check if the RESTID exist or not in database
	if (!db.isExisting('restaurants', 'rest_id', restaurantId))
		res.json(400, util.showError('Restaurant does not exist'));

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
				res.json(400, util.showError(err.message));
			}
			else {
				res.send(200, 'ok'); // TO DO : we can change to json-formatted success
			}
		});
	}
});

module.exports = router;
