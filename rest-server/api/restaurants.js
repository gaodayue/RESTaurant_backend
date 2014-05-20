var express = require('express'),
    router = express.Router(),
    iz = require('iz'),
    are = iz.are,
    validators = iz.validators,
    validationRules = require('../utils/validation_rules'),
    util = require('../utils/util'),
    db = require('../utils/database'),
    connection = db.connection(),
    async = require('async'),
    passport = require('passport'),
    GooglePlaces = require('google-places'),
    _ = require('underscore');

//var APIKEY = 'AIzaSyA8E3NtmVFzMBXUm3cPXASzAkN8GZ6MaiA'; // server-lock APIKEY
var APIKEY = 'AIzaSyDaLZXakZw5zx3y8xpWQRtSBvJwMSw8ffM'; // browser apps

router.get('/nearby', passport.authenticate('bearer', { session: false }), function(req, res) {
  /** NOTES : everytime user fetch nearby thing, we would update
    * the whole DB with INSERT IGNORE or INSERT .. on DUPLICATE KEY UPDATE (?)
    * One place will have only one id and can have multiple references. >> Google Places Data
    */ 
  // siyuan building : [39.95158836249126,116.34070884788514]
  var latitude = req.param('latitude'),
      longitude = req.param('longitude'),
      page = req.param('page');

  if(!page) page = 1;
  if(!latitude) res.json(400, util.showError('missing latitude!')); // TODO : ADD VALIDATION
  else if(!longitude) res.json(400, util.showError('missing longitude!')); // TODO : ADD VALIDATION
  else {
    var query;
    async.waterfall([
      function(callback){
        var sql = 'SELECT rest_id, rest_name AS name, rest_address AS address, rest_geo_location AS geo_location, rest_pic AS pic, '+
                  'rest_pic_thumb AS pic_thumb, rest_category AS category, ra_id AS mgr_id, ra_name AS mgr_name, '+
                  '6371 * 2 * ASIN(SQRT( POWER(SIN(('+latitude+' -Y(rest_geo_location)) * pi()/180 / 2), 2) +'+
                  'COS('+latitude+' * pi()/180) * COS('+latitude+' * pi()/180) *POWER(SIN(('+longitude+' -X(rest_geo_location)) * pi()/180 / 2), 2) )) as distance '+
                  'FROM restaurants '+
                  'LEFT JOIN restaurant_accounts ON rest_owner_id = ra_id ORDER BY distance ASC, rest_id ASC LIMIT ?,?';
        query = connection.query(sql, [(page-1)*util.PAGING_VALUE,util.PAGING_VALUE],function(err, result){
          if(err)
            callback(err);
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
            res.json(200, []);
          else
            res.json(500, util.showError(err));
        }
        else
          res.json(200, result);
    });
  }

  // GOOGLE PLACES
  /*var places = new GooglePlaces(APIKEY);
  var options = {
    //userIp: '118.193.54.222', // the cloud server ip address
    location: [latitude, longitude],
    radius: null, //meter - have to declare it null manually because the library always have default value
    sensor: false, //, 
    //language: 'en', //optional , zh-CN for Chinese Simplified
    rankby: 'distance',
    types: ['restaurant','food']
    // pagetoken: '' // Returns the next 20 results from a previously run search
  };
  places.search(options, function(err, response) {
    if(err) throw err;
    else res.json(response);

    if(util.isArrayNotEmpty(response.results)) {
      places.details({reference: response.results[0].reference}, function(err, response) {
        console.log("search details: ", response.result);
      });
    }
  });*/

});

router.get('/show/:RESTID', passport.authenticate('bearer', { session: false }), function(req, res) {
  var latitude = req.param('latitude'),
      longitude = req.param('longitude');
  var restaurantId = req.params.RESTID;
  var data, query;
  if(!restaurantId)
    res.json(400, util.showError('invalid restaurant ID'));
  else{
    async.waterfall([
      function(callback){
        // check if the RESTID exist or not in database
        var sql = 'SELECT *, '+
                  '6371 * 2 * ASIN(SQRT( POWER(SIN(('+latitude+' -Y(rest_geo_location)) * pi()/180 / 2), 2) +'+
                  'COS('+latitude+' * pi()/180) * COS('+latitude+' * pi()/180) *POWER(SIN(('+longitude+' -X(rest_geo_location)) * pi()/180 / 2), 2) )) as distance '+
                  'FROM restaurants WHERE rest_id = ? LIMIT 1';
        query = connection.query(sql, restaurantId, function(err, restRow) {
          if(err)
            callback(err);
          else {
            if (typeof restRow !== 'undefined' && restRow.length > 0)
              callback(null, restRow[0]);
            else
              callback('not exist');
          }
        });
      },
      function(arg1, callback){
        query = connection.query('SELECT d_id, d_name AS name, d_price AS price FROM dishes WHERE d_rest_id = ?', restaurantId, function(err, dishRow) {
          if (err)
            callback(err);
          else {
            var data = {
              'rest_id' : arg1.rest_id,
              'name' : arg1.rest_name,
              'address' : arg1.rest_address,
              'geo_location' : {
                'longitude' : arg1.rest_geo_location.x,
                'latitude' : arg1.rest_geo_location.y
              },
              'pic' : arg1.rest_pic,
              'pic_thumb' : arg1.rest_pic_thumb,
              'category' : arg1.rest_category,
              'distance' : arg1.distance,
              'dishes' : dishRow
            };
            callback(null, data);
          }
        });
      }
    ], function(err, result){
      if(err){
        if(err === 'not exist')
          res.json(200, []);
        else
          res.json(500, util.showError(err));
      }
      else
        res.json(200, result);
    });
  }
});

router.get('/search', passport.authenticate('bearer', { session: false }), function(req, res) {
  var keyword = req.param('keyword'),
      latitude = req.param('latitude'),
      longitude = req.param('longitude'),
      page = req.param('page');
  if(!page) page = 1;
  if(!keyword) res.json(400, util.showError('invalid parameter keyword!'));
  else if(!latitude) res.json(400, util.showError('missing latitude!')); // TODO : ADD VALIDATION
  else if(!longitude) res.json(400, util.showError('missing longitude!')); // TODO : ADD VALIDATION
  else {
    async.waterfall([
      function(callback){
        var sql = 'SELECT rest_id, rest_name AS name, rest_address AS address, rest_geo_location AS geo_location, rest_pic AS pic, '+
                  'rest_pic_thumb AS pic_thumb, rest_category AS category, ra_id AS mgr_id, ra_name AS mgr_name, '+
                  '6371 * 2 * ASIN(SQRT( POWER(SIN(('+latitude+' -Y(rest_geo_location)) * pi()/180 / 2), 2) +'+
                  'COS('+latitude+' * pi()/180) * COS('+latitude+' * pi()/180) *POWER(SIN(('+longitude+' -X(rest_geo_location)) * pi()/180 / 2), 2) )) as distance '+
                  'FROM restaurants LEFT JOIN restaurant_accounts ON rest_owner_id = ra_id '+
                  'WHERE rest_name LIKE "%'+keyword+'%" OR rest_category LIKE "%'+keyword+'%" LIMIT ?,?';
        query = connection.query(sql, [(page-1)*util.PAGING_VALUE,util.PAGING_VALUE],function(err, result){
          if(err)
            callback(err);
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
            res.json(200, []);
          else
            res.json(500, util.showError(err));
        }
        else
          res.json(200, result);
    });
  }
});

module.exports = router;
