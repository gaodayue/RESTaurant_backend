var express = require('express'),
		router = express.Router(),
		iz = require('iz'),
    are = iz.are,
    validators = iz.validators,
    validationRules = require('../utils/validation_rules'),
    errorHandler = require('../utils/error_handler');

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'project'
});

connection.on('error', function(err) {
  console.log(err.code); // example : 'ER_BAD_DB_ERROR'
});

//connection.connect();

/* GET nearby restaurants. */
router.get('/nearby', function(req, res) {
  res.send('TO BE IMPLEMENTED');
});

router.get('/show/:RESTID', function(req, res) {
	res.send('qwerty');
});

router.post('/create', function(req, res) {
	var restaurant = req.body;
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
    res.statusCode = 400; // Bad request
    res.json(errorHandler.showError(errorMessage));
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
			'rest_name' : restaurant.r_name,
			'rest_address' : restaurant.r_addr,
			//'rest_geo_location' : geo,
			'rest_pic' : pic
		};
		// insert to database
		var query = connection.query('INSERT INTO restaurants SET rest_geo_location = GeomFromText(?), ?', ['POINT('+restaurant.r_longitude+' '+restaurant.r_latitude+')',data], function(err, result) {
			if (err) {
				res.statusCode = 400;
				res.json(errorHandler.showError(err.message));
			}
			else {
				res.statusCode = 200;
				res.send('ok'); // TO DO : we can change to json-formatted success
			}
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
	var query = connection.query('SELECT rest_id FROM restaurants WHERE rest_id = ?', [restaurantId], function(err, result) {
		if (err) {
			res.statusCode = 400;
			res.json(errorHandler.showError(err.message));
		}
		if (typeof result !== 'undefined' && result.length > 0) {
    	// the array is defined and has at least one element
		}
		else {
			res.statusCode = 400;
			res.json(errorHandler.showError('Restaurant does not exist!'));
		}
	});
	
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
    res.statusCode = 400; // Bad request
    res.json(errorHandler.showError(errorMessage));
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
			'rest_name' : restaurant.r_name,
			'rest_address' : restaurant.r_addr,
			//'rest_geo_location' : geo,
			'rest_pic' : pic
		};
		// update to database
		var query = connection.query('UPDATE restaurants SET rest_geo_location = GeomFromText(?), ? WHERE rest_id = ?', ['POINT('+restaurant.r_longitude+' '+restaurant.r_latitude+')',data, restaurantId], function(err, result) {
			if (err) {
				res.statusCode = 400;
				res.json(errorHandler.showError(err.message));
			}
			else {
				res.statusCode = 200;
				res.send('ok'); // TO DO : we can change to json-formatted success
			}
		});
	}
});

module.exports = router;
