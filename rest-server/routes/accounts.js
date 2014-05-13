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

router.get('/', function(req, res) {
  var query;
  async.waterfall([
    function(callback){
      query = connection.query('SELECT cust_id, cust_name as name, cust_phoneno as phoneno FROM customer_accounts', function(err, result){
        if(err)
          callback('error');
        else {
          if(typeof result !== 'undefined' && result.length > 0){
            callback(null, result);
          }
          else
            callback('not exist');
        }
      });
    }
  ], function(err, result){
      if(err){
        if(err === 'error')
          res.json(500, util.showError('unexpected error'));
        else if(err === 'not exist')
          res.json(500, util.showError('no account exist yet'));
      }
      else
        res.json(200, result);
  });
});

router.post('/signup', function(req, res) {
  var account = req.body;
  var query;
  // validate input first
  var rules = are(validationRules.cust_account_signup_rules);
  if (!rules.validFor(account)) {
    var invalidFields = rules.getInvalidFields();
    var errorMessage = invalidFields[Object.keys(invalidFields)[0]][0]; // only need to retrieve the last error
    res.json(400, util.showError(errorMessage));
  }
  else {
    async.waterfall([
      function(callback){
        var post = {
          'cust_phoneno' : account.phoneno,
          'cust_name' : account.name,
          'cust_password' : util.createHash(account.password)
        };
        query = connection.query('INSERT INTO customer_accounts SET ?', post, function(err, result){
          if(err){
            if(err.code === 'ER_DUP_ENTRY') callback('duplicate');
            else callback('error');
          }
          else{
            custId = result.insertId;
            callback(null, custId, account.name);
          } 
        });
      },
      function(arg1, arg2, callback){
        var data = {
          'cust_id' : arg1,
          'cust_name' : arg2//,
          //'cust_access_token' : uuid.v1()
        };
        // set redis token
        callback(null, data);
      }
    ], function(err, result){
      if(err){
        if(err === 'duplicate') res.json(400, util.showError('duplicate phoneno!'));
        else res.json(500, util.showError('unexpected error'));
      }
      res.json(200, result);
    });
  }
});

router.post('/signin', function(req, res) {
  var account = req.body;
  // validate input first
  var rules = are(validationRules.cust_account_signin_rules);
  if (!rules.validFor(account)) {
    var invalidFields = rules.getInvalidFields();
    var errorMessage = invalidFields[Object.keys(invalidFields)[0]][0]; // only need to retrieve the last error
    res.json(400, util.showError(errorMessage));
  }
  else {
    async.waterfall([
      function(callback){
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
        // compare arg1 which is stored hash with the hashed account.password
        var test = util.checkHash(account.password, arg1.cust_password);
        if(!test)
          callback('invalid');
        else
          callback(null, arg1);
      },
      function(arg1, callback){
        // var accessToken = redis.get
        var data = {
          'cust_id' : arg1.cust_id,
          'cust_name' : arg1.cust_name//,
          //'cust_access_token' : accessToken
        };
        callback(null, data);
      }
    ], function(err, result){
      if(err){
        if(err === 'invalid'){
          res.json(400, util.showError('invalid username/password'));
        }
        else {
          res.json(500, util.showError('unexpected error'));
        }
      }
      res.json(200, result);
    });
  }
});

module.exports = router;