var crypto = require('crypto');

exports.createHash = function (s) {
	var h,
			salt = crypto.randomBytes(128).toString('base64');
  crypto.pbkdf2('thepassword', salt, 10000, 256, function(err, derivedKey) {
    //console.log('Have %d base64 of random data: %s', derivedKey.toString('base64').length, derivedKey.toString('base64'));
    h = derivedKey.toString('base64') + ':' + salt;
    //console.log('Have %d base64 of random data: %s', h.length, h);
  });
  return h;
};

exports.showError = function (errorMessage) {
	var data = {
		'result' : 'error',
		'error_message' : errorMessage
	};
	return data;
};