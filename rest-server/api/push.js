var express = require('express'),
    router = express.Router(),
    BaiduPush = require('baidupush')
    util = require('../utils/util'),
    db = require('../utils/database'),
    config = require('../config'),
    connection = db.connection(),
    async = require('async'),
    passport = require('passport'),
    uuid = require('node-uuid');

router.get('/send/:ID', function(req, res) {
  var body = req.body;
  var baiduPushClient = BaiduPush.buildBaseApi({apiKey: config.baidu_apikey, secretKey: config.baidu_secretkey});

  connection.query('select cust_push_id from customer_accounts where cust_id = ?', req.params.ID, function(err, result){
    var queryBody = {};
    queryBody.push_type = 1;
    queryBody.messages = {
      title: 'spam!',
      description: 'spamspamspam',
      /*custom_content : {
        invitation_id: 1,
        key2: 'value2'
      }*/
    };
    queryBody.user_id = result[0].cust_push_id;

    queryBody.msg_keys = uuid.v4(); // just random message key to be unique
    queryBody.message_type = 1; // 0:toast, 1:notification

    baiduPushClient.pushMsg(queryBody, function (err, body) {
      console.log(body);
      res.json(200, 'ok');
    });
  }); // bigred
  //queryBody.user_id = '729915559012261118'; // TODO : fill the user ID from database
  
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
      if(err) res.json(500, util.showError(err));
      else {
        res.json(200, 'ok');
      }
    });
  }
});

/*router.post('/send', passport.authenticate('bearer', { session: false }), function (req, res) {
  // TODO : send specific push notification to targeted user
  var custId = req.user.cust_id;
  var post = req.body;
  res.send('tbd');
});*/

module.exports = router;