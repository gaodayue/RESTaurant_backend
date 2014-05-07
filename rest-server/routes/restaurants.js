// DANGEROUS, UNTESTED BAD CODE BELOW

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

router.get('/nearby', function(req, res) {
  res.send('TO BE IMPLEMENTED');
});

router.get('/show/:RESTID', function(req, res) {
	var restaurantId = req.params.RESTID;
	var data, query;
	if (restaurantId != parseInt(restaurantId))
		res.json(400, util.showError('invalid request'));
	else{
		async.waterfall([
			function(callback){
				// check if the RESTID exist or not in database
				query = connection.query('SELECT * FROM restaurants WHERE rest_id = ? LIMIT 1', restaurantId, function(err, restRow) {
					if(err)
						callback('error');
					else {
						if (typeof restRow !== 'undefined' && restRow.length > 0)
							callback(null, restRow[0]);
						else
							callback('not exist');
					}
				});
			},
			function(arg1, callback){
				query = connection.query('SELECT * FROM dishes WHERE d_rest_id = ?', restaurantId, function(err, dishRow) {
					if (err)
						callback('error');
					else {
						var data = {
							'rest_id' : arg1.rest_id,
							'name' : arg1.rest_name,
							'address' : arg1.rest_address,
							'geo_location' : {
								'longitude' : arg1.rest_geo_location.x,
								'latitude' : arg1.rest_geo_location.y
							},
							'pic' : arg1.rest_pic,
							'dishes' : dishRow
						};
						callback(null, data);
					}
				});
			}
		], function(err, result){
			if(err){
				if(err === 'error')
					res.json(400, util.showError('unexpected error'));
				else if(err === 'not exist')
					res.json(400, util.showError('Restaurant does not exist'));
			}
			else
				res.json(200, result);
		});
	}
});

module.exports = router;
