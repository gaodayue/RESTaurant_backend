var crypto = require('crypto');

exports.PAGING_VALUE = 20;

exports.createHash = function (p) {
	var salt = crypto.randomBytes(128);//.toString('base64');
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