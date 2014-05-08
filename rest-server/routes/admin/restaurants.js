var express = require('express'),
    router = express.Router(),
    iz = require('iz'),
    are = iz.are,
    validators = iz.validators,
    validationRules = require('../../utils/validation_rules'),
    util = require('../../utils/util'),
    db = require('../../utils/database'),
    connection = db.connection(),
    async = require('async');

// all routes in this file begins with "/admin/restaurants"

router.get('/', function(req, res) {
  var query;
  async.waterfall([
    function(callback){
      var sql = 'SELECT rest_id, rest_name AS name, rest_address AS address, rest_geo_location AS geo_location, '+
                'rest_pic AS pic, ra_id AS mgr_id, ra_name AS mgr_name '+
                'FROM restaurants, restaurant_accounts '+
                'WHERE rest_owner_id = ra_id';
      query = connection.query(sql, function(err, result){
        if(err)
          callback('error');
        else {
          if(typeof result !== 'undefined' && result.length > 0){
            for(var i in result){
              result[i].geo_location.longitude = result[i].geo_location.x;
              delete result[i].geo_location.x;
              result[i].geo_location.latitude = result[i].geo_location.y;
              delete result[i].geo_location.y;
            }
            callback(null, result);
          }
          else
            callback('not exist');
        }
      });
    }
  ], function(err, result){
      if(err){
        if(err === 'not exist')
          res.json(400, util.showError('no restaurants!'));
        else
          res.json(400, util.showError('unexpected error'));
      }
      else
        res.json(200, result);
  });
});

router.get('/:RESTID', function (req, res) {
  var restaurantId = req.params.RESTID;
  if (restaurantId != parseInt(restaurantId))
    return res.json(400, util.showError('invalid request'));
  
  async.waterfall([
    function (callback) {
      var sql = 'SELECT rest_id, rest_name AS name, rest_address AS address, rest_geo_location AS geo_location, '+
                'rest_pic AS pic, ra_id AS mgr_id, ra_name AS mgr_name '+
                'FROM restaurants, restaurant_accounts '+
                'WHERE rest_owner_id = ra_id and rest_id = ?';
      connection.query(sql, restaurantId, function (err, result) {
        if(err)
          return callback('dberror');
        if (!result || result.length === 0)
          return callback('not exist');

        result[0].geo_location.longitude = result[0].geo_location.x;
        delete result[0].geo_location.x;
        result[0].geo_location.latitude = result[0].geo_location.y;
        delete result[0].geo_location.y;
        return callback(null, result);
      });
    }],
    function (err, result) {
      if (err)
        if (err === 'not exist')
          return res.json(404, util.showError('no such restaurant!'));
        else
          return res.json(500, util.showError('unexpected error'));
      return res.json(200, result);
  });
});

router.post('/create', function(req, res, next) {
  // TODO : need transaction optimized (now 700++ ms);
  var query;
  var restaurant = req.body;
  var post = {
    'r_name' : restaurant.r_name,
    'r_addr' : restaurant.r_addr,
    'r_longitude' : restaurant.r_longitude,
    'r_latitude' : restaurant.r_latitude,
    'r_pic' : restaurant.r_pic,
    'r_mgr_name' : restaurant.r_mgr_name, // this is to create restaurant_account
    'r_mgr_pwd' : restaurant.r_mgr_pwd // this is to create restaurant_account
  };
  // validate input first
  var rules = are(validationRules.restaurants_rules);
  if (!rules.validFor(post)) {
    var invalidFields = rules.getInvalidFields();
    var errorMessage = invalidFields[Object.keys(invalidFields)[0]][0]; // only need to retrieve the last error
    res.json(400, util.showError(errorMessage));
  }
  else {
    /*async.waterfall([
      function(callback){
        var geo, pic, raId;
        // create RESTAURANT_ACCOUNT and then get the raId
        var ra = {
          'ra_name' : restaurant.r_mgr_name,
          'ra_password' : util.createHash(restaurant.r_mgr_pwd)
        };
        query = connection.query('INSERT INTO restaurant_accounts SET ?', ra, function(err, result) {
          if (err)
            callback('error');
          else {
            callback(null, result.insertId);
          }
        });
      },
      function(arg1, callback){
        if (restaurant.r_longitude && restaurant.r_latitude)
          geo = 'GeomFromText("POINT('+restaurant.r_longitude+' '+restaurant.r_latitude+')")';
        else
          geo = null;
        pic = restaurant.r_pic ? restaurant.r_pic : null;
        var data = {
          'rest_owner_id' : arg1,
          'rest_name' : post.r_name,
          'rest_address' : post.r_addr,
          'rest_pic' : pic
        };
        // insert to database
        query = connection.query('INSERT INTO restaurants SET rest_geo_location = GeomFromText(?), ?', ['POINT('+restaurant.r_longitude+' '+restaurant.r_latitude+')',data], function(err, result) {
          if (err)
            callback('error');
          else
            callback(null, data);
        });
      }
    ], function(err, result){
      if(err){
        if(err === 'error')
          res.json(400, 'unexpected error');
        else
          res.json(400, err);
      }
      else
        res.json(200, 'ok')
    });*/
    connection.beginTransaction(function(err) {
      if (err)
        res.json(400, util.showError('unexpected error'));
      else {
        var ra = {
          'ra_name' : post.r_mgr_name,
          'ra_password' : util.createHash(post.r_mgr_pwd)
        };
        connection.query('INSERT INTO restaurant_accounts SET ?', ra, function(err, result) {
          if (err) { 
            connection.rollback(function() {
              res.json(400, util.showError('unexpected error'));
            });
          }
          else {
            pic = post.r_pic ? post.r_pic : null;
            var data = {
              'rest_owner_id' : result.insertId,
              'rest_name' : post.r_name,
              'rest_address' : post.r_addr,
              'rest_pic' : pic
            };
            connection.query('INSERT INTO restaurants SET rest_geo_location = GeomFromText(?), ?', ['POINT('+post.r_longitude+' '+post.r_latitude+')',data], function(err, result) {
              if (err) { 
                connection.rollback(function() {
                  res.json(400, util.showError('unexpected error'));
                });
              }  
              else {
                connection.commit(function(err) {
                  if (err) { 
                    connection.rollback(function() {
                      res.json(400, util.showError('unexpected error'));
                    });
                  }
                  else {
                    console.log('success!');
                    res.json(200, 'ok');
                  }
                });
              }
            });
          }
        });
      }
    });
  } // end else
});

router.post('/update/:RESTID', function(req, res) {
  var restaurant = req.body;
  var restaurantId = req.params.RESTID;

  async.waterfall([
    function (callback) {
      var query = connection.query('SELECT * FROM restaurants WHERE rest_id = ? LIMIT 1', restaurantId, function(err, result){
        if(err)
          callback('error');
        else {
          if (typeof result !== 'undefined' && result.length > 0)
            callback(null, result[0]);
          else
            callback('not exist');
        }
      });
    },
    function (arg1, callback) { // arg1: restaurant
      var post = {
        'r_name' : restaurant.r_name ? restaurant.r_name : arg1.rest_name,
        'r_addr' : restaurant.r_addr ? restaurant.r_addr : arg1.rest_address,
        'r_longitude' : restaurant.r_longitude ? restaurant.r_longitude : arg1.rest_geo_location.x,
        'r_latitude' : restaurant.r_latitude ? restaurant.r_latitude : arg1.rest_geo_location.y,
        'r_pic' : restaurant.r_pic ? restaurant.r_pic : arg1.rest_pic,
        'r_mgr_name' : 'foo',//restaurant.r_mgr_name,
        'r_mgr_pwd' : 'bar'//restaurant.r_mgr_pwd
      };
      // validate input first
      var rules = are(validationRules.restaurants_rules);
      if (!rules.validFor(post)) {
        var invalidFields = rules.getInvalidFields();
        var errorMessage = invalidFields[Object.keys(invalidFields)[0]][0]; // only need to retrieve the last error
        res.json(400, util.showError(errorMessage));
      }
      else {
        var pic = post.r_pic ? post.r_pic : null;
        var data = {
          'rest_id' : restaurantId,
          'rest_name' : post.r_name,
          'rest_address' : post.r_addr,
          'rest_pic' : pic
        };
        // update to database
        var sql = 'UPDATE restaurants SET rest_geo_location = GeomFromText(?), ? WHERE rest_id = ?';
        var query = connection.query(sql, ['POINT('+post.r_longitude+' '+post.r_latitude+')', data, restaurantId], function(err, result) {
          if (err) {
            callback('error');
          }
          else {
            callback(null, 'ok');
          }
        });
      }
    }
  ], function (err, result){
      if(err){
        if (err == 'not exist')
          res.json(400, util.showError('Restaurant does not exist'));
        else 
          res.json(400, util.showError('unexpected error'));
      }
      else {
        res.send(200, 'ok'); // TODO : we can change to json-formatted success
      }
  });
});

module.exports = router;
