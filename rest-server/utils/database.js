var mysql      = require('mysql');
var async = require('async');
/*var c = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'project'
});*/ // local
var c = mysql.createConnection({
  host     : '118.193.54.222',
  user     : 'bjtu',
  password : 'bjtu',
  database : 'project'
});

/*connection.on('error', function(err) {
  console.log(err.code); // example : 'ER_BAD_DB_ERROR'
});*/

exports.connection = function() {
	return c;
};

/*exports.isExisting = function (tableName, columnName, check) {
	async.series([
		function(callback){
			var result;
			var query = c.query('SELECT ?? FROM ?? WHERE ?? = ?', [columnName, tableName, columnName, check], function(err, result) {
				if (err)
					result = false;
				if (typeof result !== 'undefined' && result.length > 0){
			  	result = true; // the array is defined and has at least one element
				}
				else{
					result = false;
				}
			});
			callback(null, result);
		}
	], function(err,result){
		return result;
	});
};*/