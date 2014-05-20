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
    uuid = require('node-uuid'),
    redis = require('redis'),
    redisClient = redis.createClient()
    jwt = require('jwt-simple'),
    config = require('../config'),
    passport = require('passport');

router.get('/', function(req, res) {
  var query;
  async.waterfall([
    function(callback){
      query = connection.query('SELECT cust_id, cust_name as name, cust_phoneno as phoneno FROM customer_accounts', function(err, result){
        if(err)
          callback(err);
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
        if(err === 'not exist')
          res.json(200, []);
        else
          res.json(500, util.showError(err));
      }
      else
        res.json(200, result);
  });
});

router.post('/signup', function(req, res) {
  // TODO : have some admin access_token to authorize creating a new customer account
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
            else callback(err);
          }
          else{
            custId = result.insertId;
            callback(null, custId, account.name);
          } 
        });
      },
      function(arg1, arg2, callback){ // arg1: cust_id, arg2: cust_name
        var t = uuid.v1();
        var data = {
          'cust_id' : arg1,
          'cust_name' : arg2,
          //'cust_access_token' : arg1+':'+uuid.v1()
          'cust_access_token' : jwt.encode({cust_id:arg1, token:t}, config.jwt_secret)
        };
        redisClient.set('cust:'+data.cust_id, t, function(err, result) {
          if(err) callback(err);
          else callback(null, data);
        });
      }
    ], function(err, result){
      if(err){
        if(err === 'duplicate') res.json(400, util.showError('duplicate phoneno!'));
        else res.json(500, util.showError(err));
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
            callback(err);
          }
          else{
            if (typeof result !== 'undefined' && result.length > 0)
              callback(null, result[0]);
            else
              callback('invalid');
          } 
        });
      },
      function(arg1, callback){ //arg1 : customer_accounts object
        // compare arg1.cust_password which is stored hash with the hashed account.password
        var test = util.checkHash(account.password, arg1.cust_password);
        if(!test)
          callback('invalid');
        else
          callback(null, arg1);
      },
      function(arg1, callback){ //arg1 : customer_accounts object
        // var accessToken = redis.get
        var t = uuid.v1();
        var data = {
          'cust_id' : arg1.cust_id,
          'cust_name' : arg1.cust_name,
          //'cust_access_token' : arg1.cust_id+':'+uuid.v1()
          'cust_access_token' : jwt.encode({cust_id:arg1.cust_id, token:t}, config.jwt_secret)
        };
        redisClient.set('cust:'+data.cust_id, t, function(err, result) {
          if(err) callback(err);
          else callback(null, data);
        });
      }
    ], function(err, result){
      if(err){
        if(err === 'invalid') res.json(400, util.showError('invalid username/password'));
        else res.json(500, util.showError(err));
      }
      res.json(200, result);
    });
  }
});

router.post('/logout', passport.authenticate('bearer', { session: false }), function (req, res) {
  var custId = req.user.cust_id;
  if(!custId) res.json(400, util.showError('missing customer ID'));
  else {
    redisClient.del('cust:'+custId, function(err, result) {
      if(err) res.json(500, util.showError(err));
      else res.json(200, 'logout success');
    });
  }
});

module.exports = router;