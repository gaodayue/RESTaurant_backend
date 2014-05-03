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
  password : 'root'
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
	var data = {
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
	if (!rules.validFor(data)) {
    var invalidFields = rules.getInvalidFields();
    var errorMessage = invalidFields[Object.keys(invalidFields)[0]][0]; // only need to retrieve the last error
    res.statusCode = 400; // Bad request
    res.json(errorHandler.showError(errorMessage));
	}
	else {
		res.statusCode = 200;
		res.send('ok'); // TO DO : we can change to json-formatted success
	}
});

router.post('/update/:RESTID', function(req, res) {

});

module.exports = router;
