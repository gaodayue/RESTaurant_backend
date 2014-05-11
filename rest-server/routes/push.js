var express = require('express'),
    router = express.Router(),
    BaiduPush = require('baidupush');

var APIKEY = 'hwfeocSIPlgKTasIuARPREnS';
var SECRETKEY = 'AUC9iIPVi5h87xPMuovh7nBiiuwuCUVg';

/*router.get('/', function(req, res) {
	var body = req.body;
	var baiduPushClient = BaiduPush.buildBaseApi({apiKey: APIKEY, secretKey: SECRETKEY});

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
  queryBody.user_id = '729915559012261118'; // TODO : fill the user ID from database
  queryBody.msg_keys = 'invitation';
  queryBody.message_type = 1; // 0:toast, 1:notification

  baiduPushClient.pushMsg(queryBody, function (err, body) {
    console.log(body);
    res.json(200, 'ok');
  });
});*/

module.exports = router;