var mysql = require('mysql');
var c = mysql.createConnection({
  host     : 'localhost',
  user     : 'bjtu',
  password : 'bjtu',
  database : 'restaurant'
});

// enable error logging for each connection query
c.on('error', function(err) {
  console.log(err.code); // example : 'ER_BAD_DB_ERROR'
});

exports.connection = function() {
	return c;
};
