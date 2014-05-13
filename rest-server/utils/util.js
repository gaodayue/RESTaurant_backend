var crypto = require('crypto');/*,
    redis = require('redis'),
    redisClient = redis.createClient();*/

exports.PAGING_VALUE = 20;
exports.ADMIN_TOKEN = '';

exports.checkAuthRest = function (req, res, next) {
  if(req.params.RESTID)
    id = req.params.RESTID;
  if(req.param('r_id'))
    id = req.param('r_id');
  if(req.body.r_id)
    id = req.body.r_id;
  redisClient.get('rest:'+id, function (err, result) {
    if (err)
      res.json(500, {result : 'error', error_message : 'internal server error'});
    if (result === null)
      res.json(401, {result : 'error', error_message : 'unauthorized'});
    else {
      res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
      next();
    }
  });
};

exports.checkAuthCust = function (req, res, next) {
  //if(req.params.RESTID)
  //  id = req.params.RESTID;
  if(req.param('customer_id'))
    id = req.param('customer_id');
  if(req.body.customer_id)
    id = req.body.customer_id;
  redisClient.get('cust:'+id, function (err, result) {
    if (err)
      res.json(500, {result : 'error', error_message : 'internal server error'});
    if (result === null)
      res.json(401, {result : 'error', error_message : 'unauthorized'});
    else {
      res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
      next();
    }
  });
};

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