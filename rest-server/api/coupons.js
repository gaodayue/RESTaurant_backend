var express = require('express'),
    router = express.Router(),
    iz = require('iz'),
    are = iz.are,
    validators = iz.validators,
    validationRules = require('../utils/validation_rules'),
    util = require('../utils/util'),
    db = require('../utils/database'),
    connection = db.connection(),
    async = require('async');

router.get('/', function(req, res) {
	res.send('tbd');
});

router.post('/create', function(req, res) {
	res.send('tbd');	
});

router.post('/send', function(req, res) { // push notification to user which used to eat at the specified restaurant.
	res.send('tbd');	
});

module.exports = router;
