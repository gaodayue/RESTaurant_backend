var express = require('express'),
    router = express.Router(),
    BaiduPush = require('baidupush')
    util = require('../utils/util'),
    db = require('../utils/database'),
    config = require('../config'),
    connection = db.connection(),
    async = require('async'),
    passport = require('passport');

router.get('/', function(req, res) {
  var body = req.body;
  var baiduPushClient = BaiduPush.buildBaseApi({apiKey: config.baidu_apikey, secretKey: config.baidu_secretkey});

  var queryBody = {};
  queryBody.push_type = 1;
  queryBody.messages = {
    title: 'new invitation',
    description: 'let\'s have dinner together',
    custom_content : {
      key1: 'value1',
      key2: 'value2'
    }
  };
  connection.query('select cust_push_id from customer_accounts where cust_id = 6', function(err, result){
    queryBody.user_id = result[0].cust_push_id;
  }); // bigred
  //queryBody.user_id = '729915559012261118'; // TODO : fill the user ID from database
  queryBody.msg_keys = 'invitation';
  queryBody.message_type = 1; // 0:toast, 1:notification

  baiduPushClient.pushMsg(queryBody, function (err, body) {
    console.log(body);
    res.json(200, 'ok');
  });
});

router.post('/register', passport.authenticate('bearer', { session: false }), function (req, res) {
  // TODO : update customer_accounts.push_id 
  var post = req.body;
  var pushId = req.body.push_id;
  var custId = req.user.cust_id;
  if(!custId) res.json(400, util.showError('missing the customer_id'));
  else if(!pushId) res.json(400, util.showError('missing the push_id'));
  else {
    var sql = 'UPDATE customer_accounts SET cust_push_id = ? WHERE cust_id = ?';
    connection.query(sql, [pushId, custId], function (err, result) {
      if(err) res.json(500, util.showError('database error'));
      else {
        res.json(200, 'ok');
      }
    });
  }
});

router.post('/send', passport.authenticate('bearer', { session: false }), function (req, res) {
  // TODO : send specific push notification to targeted user
  var custId = req.user.cust_id;
  var post = req.body;
  res.send('tbd');
});

module.exports = router;