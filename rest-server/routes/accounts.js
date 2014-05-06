var express = require('express'),
		router = express.Router(),
		iz = require('iz'),
    are = iz.are,
    validators = iz.validators,
    validationRules = require('../utils/validation_rules'),
    util = require('../utils/util'),
    db = require('../utils/database'),
    connection = db.connection(),
    async = require('async'),
    uuid = require('node-uuid');

router.post('/signup', function(req, res) {
  var account = req.body;
  var query;
  // validate input first
	var rules = are(validationRules.accounts_rules);
	if (!rules.validFor(account)) {
		var invalidFields = rules.getInvalidFields();
		var errorMessage = invalidFields[Object.keys(invalidFields)[0]][0]; // only need to retrieve the last error
		res.json(400, util.showError(errorMessage));
	}
	else {
		async.waterfall([
			function(callback){
				var access_token = uuid.v1();
				var post = {
					'cust_phoneno' : account.phoneno,
					'cust_name' : '', // default
					'cust_password' : util.createHash(account.password),
					'cust_access_token' : access_token
				};
				query = connection.query('INSERT INTO customer_accounts SET ?', post, function(err, result){
					if(err){
						callback('error');
					}
					else{
						custId = result.insertId;
						callback(null, custId, access_token);
					}	
				});
			},
			function(arg1, arg2, callback){
				var data = {
					'cust_id' : arg1,
					'cust_access_token' : arg2
				};
				callback(null, data);
			}
		], function(err, result){
			if(err)
				res.json(400, util.showError('unexpected error'));
			res.json(200, result);
		});
	}
});

router.post('/signin', function(req, res) {
  var account = req.body;
  // validate input first
	var rules = are(validationRules.accounts_rules);
	if (!rules.validFor(account)) {
		var invalidFields = rules.getInvalidFields();
		var errorMessage = invalidFields[Object.keys(invalidFields)[0]][0]; // only need to retrieve the last error
		res.json(400, util.showError(errorMessage));
	}
	else {
		async.waterfall([
			function(callback){
				console.log('hello');
				query = connection.query('SELECT * FROM customer_accounts WHERE cust_phoneno = ?', account.phoneno, function(err, result){
					if(err){
						callback('error');
					}
					else{
						if (typeof result !== 'undefined' && result.length > 0)
							callback(null, result[0]);
						else
							callback('invalid');
					}	
				});
			},
			function(arg1, callback){
				console.log('hello');
				// compare arg1 which is stored hash with the hashed account.password
				var test = util.checkHash(account.password, arg1.cust_password);
				if(!test)
					callback('invalid');
				else
					callback(null, arg1);
				//if (arg1.cust_passwod !=== hash)
					//callback('invalid');
			},
			function(arg1, callback){
				var data = {
					'cust_id' : arg1.cust_id,
					'cust_access_token' : arg1.cust_access_token
				};
				callback(null, data);
			}
		], function(err, result){
			if(err){
				if(err === 'invalid'){
					res.json(400, util.showError('invalid username/password'));
				}
				else {
					res.json(400, util.showError('unexpected error'));
				}
			}
			res.json(200, result);
		});
	}
});

module.exports = router;