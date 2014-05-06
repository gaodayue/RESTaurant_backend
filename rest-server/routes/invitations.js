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
  res.send('TO BE IMPLEMENTED');
});

router.get('/:INVID', function(req, res) {
	var invitationId = req.params.INVID;
  res.send('TO BE IMPLEMENTED');
});

router.post('/create', function(req, res) {
  var invitation = req.body;
	// validate input first
	var rules = are(validationRules.invitations_rules);
	if (!rules.validFor(invitation)) {
    var invalidFields = rules.getInvalidFields();
    var errorMessage = invalidFields[Object.keys(invalidFields)[0]][0]; // only need to retrieve the last error
    res.json(400, util.showError(errorMessage));
	}
	for(var i in invitation.dishes){
		rules = are(validationRules.invitation_dishes_rules);
		if (!rules.validFor(invitation.dishes[i])) {
			var invalidFields = rules.getInvalidFields();
	    var errorMessage = invalidFields[Object.keys(invalidFields)[0]][0]; // only need to retrieve the last error
	    res.json(400, util.showError(errorMessage));
		}
	}
	res.json(200, invitation);
});

router.post('/accept/:INVID', function(req, res) {
	var invitationId = req.params.INVID;
  res.send('TO BE IMPLEMENTED');
});

router.post('/deny/:INVID', function(req, res) {
	var invitationId = req.params.INVID;
  res.send('TO BE IMPLEMENTED');
});

module.exports = router;