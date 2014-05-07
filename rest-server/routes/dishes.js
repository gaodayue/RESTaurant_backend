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

router.post('/create', function(req, res) {
	var dishes = req.body;
	var post = {
		'r_id' : dishes.r_id,
		'name' : dishes.name,
		'price' : dishes.price
	};
	// validate input first
	var rules = are(validationRules.dishes_rules);
	if (!rules.validFor(post)) {
    var invalidFields = rules.getInvalidFields();
    var errorMessage = invalidFields[Object.keys(invalidFields)[0]][0]; // only need to retrieve the last error
    res.json(400, util.showError(errorMessage));
	}
	else {
		async.series([
			function(callback){
				var data = {
					'd_rest_id' : post.r_id,
					'd_name' : post.name,
					'd_price' : post.price,
					'd_display_order' : 0 // TODO : determine default value
				};
				// insert to database
				query = connection.query('INSERT INTO dishes SET ?', data, function(err, result) {
					if (err)
						callback('error');
					else
						callback(null, 'ok');
				});
			}
		], function(err, result){
			if(err)
				res.json(400, 'unexpected error');
			else
				res.send(200, 'ok');
		});
	}
})

router.post('/update/:DISHID', function(req, res) {
	var dishId = req.params.DISHID;
	var dishes = req.body;

	async.waterfall([
		function(callback){
			var result;
			var query = connection.query('SELECT d_id, d_name, d_price FROM dishes WHERE d_id = ?', dishId, function(err, row){
				if(err)
					callback('error');
				else {
					if (typeof row !== 'undefined' && row.length > 0)
				  	callback(null, row[0]);
					else
						callback('not exist');
				}
			});
		},
		function(arg1, callback){
			var post = {
				'r_id' :dishes.r_id,
				'name' : dishes.name ? dishes.name : arg1.d_name,
				'price' : dishes.price ? dishes.price : arg1.d_price
			};
			// validate input first
			var rules = are(validationRules.dishes_rules);
			if (!rules.validFor(post)) {
		    var invalidFields = rules.getInvalidFields();
		    var errorMessage = invalidFields[Object.keys(invalidFields)[0]][0]; // only need to retrieve the last error
		    res.json(400, util.showError(errorMessage));
			}
			else {
				var data = {
					'd_name' : post.name,
					'd_price' : post.price
				};
				// update to database
				query = connection.query('UPDATE dishes SET ? WHERE d_id = ? AND d_rest_id = ?', [data, dishId, post.r_id], function(err, result) {
					if (err)
						callback('error');
					else
						callback(null, 'ok'); // TODO : we can change to json-formatted success
				});
			}
		}
	], function(err, result){
			if(err){
				if (err == 'not exist')
					res.json(400, util.showError('Dish does not exist'));
				else 
					res.json(400, util.showError('unexpected error'));
			}
			else {
				res.send(200, 'ok'); // TODO : we can change to json-formatted success
			}
	});
})

router.post('/delete/:DISHID', function(req, res) {
	var dishId = req.params.DISHID;
	var restId = req.body.r_id;
	if (!restId)
		res.json(400, util.showError('Please input restaurant ID'));
	else {
		async.series([
			function(callback){
				var result;
				var query = connection.query('SELECT d_id FROM dishes WHERE d_id = ?', dishId, function(err, row){
					if(err)
						callback('error');
					else {
						if (typeof row !== 'undefined' && row.length > 0)
					  	callback(null, result);
						else
							callback('not exist');
					}
				});
			},
			function(callback){
				// validate input first
				var rules = are(validationRules.dishes_rules);
				if (!rules.validFor(post)) {
			    var invalidFields = rules.getInvalidFields();
			    var errorMessage = invalidFields[Object.keys(invalidFields)[0]][0]; // only need to retrieve the last error
			    res.json(400, util.showError(errorMessage));
				}
				else {
					var data = {
						'd_rest_id' : post.r_id,
						'd_name' : post.name,
						'd_price' : post.price,
						'd_display_order' : 0 // TODO : determine default value
					};
					// update to database
					query = connection.query('DELETE FROM dishes WHERE d_id = ? AND d_rest_id = ?', [dishId, restId], function(err, result) {
						if (err)
							callback('error');
						else
							callback(null, 'ok'); // TODO : we can change to json-formatted success
					});
				}
			}
		], function(err, result){
				if(err){
					if (err == 'not exist')
						res.json(400, util.showError('Dish does not exist'));
					else 
						res.json(400, util.showError('unexpected error'));
				}
				else {
					res.send(200, 'ok'); // TODO : we can change to json-formatted success
				}
		});
	}
})

module.exports = router;
