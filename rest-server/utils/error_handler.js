exports.showError = function (errorMessage) {
	var data = {
		'result' : 'error',
		'error_message' : errorMessage
	};
	return data;
};