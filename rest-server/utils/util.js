var crypto = require('crypto'),
    db = require('./database'),
    BaiduPush = require('baidupush'),
    config = require('../config'),
    connection = db.connection(),
    async = require('async'),
    uuid = require('node-uuid'),
    _ = require('underscore');

// res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

exports.PAGING_VALUE = 20;
exports.ADMIN_TOKEN = '';

exports.createHash = function (p) {
  var salt = crypto.randomBytes(128)//.toString('base64');
  var h = crypto.pbkdf2Sync(p, salt, 10000, 256, function(err, derivedKey) {
    if(err)
      return reject(err);
    //console.log('Have %d base64 of random data: %s', derivedKey.toString('base64').length, derivedKey.toString('base64'));
    //derivedKey.toString('base64'));
    //console.log('Have %d base64 of random data: %s', h.length, h);
  });
  return h.toString('base64') + ':' + salt.toString('base64');
};

exports.checkHash = function (password, storedHash) {
  var meta = storedHash.split(":");
  var salt = new Buffer(meta[1], 'base64');
  var hash = meta[0];

  var h = crypto.pbkdf2Sync(password, salt, 10000, 256, function(err, derivedKey) {
    if(err)
      return reject(err);
  });
  return (hash === h.toString('base64'));
}

exports.showError = function (errorMessage) {
  var data = {
    'result' : 'error',
    'error_message' : errorMessage
  };
  return data;
};

exports.isArrayNotEmpty = function(array) {
  return (typeof array !== 'undefined' && array.length > 0) ? true : false;
};

exports.sendPush = function (queryBody, custIds) { // will return number of successful push
  // the query.messages should configured manually where this helper is called
  /*queryBody.messages = {
    title: invitation.order.customer.name + ' has just book the order!',
    description: 'Finished booking order at ' + invitation.order.restaurant.name,
    custom_content : {
      invitation_id: invitation.inv_id,
      key2: 'value2'
    }
  };*/
  async.waterfall([
    // 1. get push_id
    function (callback) {
      if(typeof custIds !== 'undefined' && custIds.length > 0) {
        var pushIds = [];
        var sql = 'SELECT cust_push_id FROM customer_accounts WHERE cust_id IN (?)';
        connection.query(sql, [custIds], function (err, result) {
          if (err) return 0;
          else {
            if (typeof result !== 'undefined' && result.length > 0) {
              for (var i in result) {
                if (result[i].cust_push_id)
                  pushIds.push(result[i].cust_push_id);
              }
              callback(null, pushIds);
            }
            else
              callback('pushid db empty');
          }
        });
      }
      else
        callback('custid empty');
    },
    // 2. send push notif
    function (pushIds, callback) {
      if(typeof pushIds !== 'undefined' && pushIds.length > 0) {
        var count = 0;
        var baiduPushClient = BaiduPush.buildBaseApi({apiKey: config.baidu_apikey, secretKey: config.baidu_secretkey});
        // just making sure push_type and message_type is this
        queryBody.push_type = 1;
        queryBody.message_type = 1; // 0:toast, 1:notification
        
        _.each(pushIds, function (pushId) {
          // send each push here one by one
          queryBody.msg_keys = uuid.v4(); // random msg_key to be unique
          queryBody.user_id = pushId;
          baiduPushClient.pushMsg(queryBody, function (err, body) {
            if (err) console.log('BAIDU PUSH :' + err);
            else {
              console.log(body);
              count++; // just return the total push
            }
          });
        });
        callback(null, count);
      }
      else
        callback('pushid empty');
    }
  ], function (err, result) {
    if (err) {
      console.log(err);
      return 0;
    }
    else return result;
  });
};