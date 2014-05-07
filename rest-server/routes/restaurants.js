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
  // temp solution
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
