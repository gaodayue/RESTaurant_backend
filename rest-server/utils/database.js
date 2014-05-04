var mysql      = require('mysql');
var c = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'project'
});

/*connection.on('error', function(err) {
  console.log(err.code); // example : 'ER_BAD_DB_ERROR'
});*/

exports.connection = function() {
	return c;
};

exports.isExisting = function (tableName, columnName, check) {
	var query = c.query('SELECT ?? FROM ?? WHERE ?? = ?', [columnName, tableName, columnName, check], function(err, result) {
		if (err)
			return false;
		if (typeof result !== 'undefined' && result.length > 0)
    	return true; // the array is defined and has at least one element
		else
			return false;
	});
};