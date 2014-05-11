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
    GooglePlaces = require('google-places');

//var APIKEY = 'AIzaSyA8E3NtmVFzMBXUm3cPXASzAkN8GZ6MaiA'; // server-lock APIKEY
var APIKEY = 'AIzaSyDaLZXakZw5zx3y8xpWQRtSBvJwMSw8ffM'; // browser apps
var PAGING_VALUE = 20;

router.get('/nearby', function(req, res) {
  /** NOTES : everytime user fetch nearby thing, we would update
    * the whole DB with INSERT IGNORE or INSERT .. on DUPLICATE KEY UPDATE (?)
    * One place will have only one id and can have multiple references. >> Google Places Data
    */ 
  // siyuan building : [39.95158836249126,116.34070884788514]
  var latitude = req.param('latitude'),
      longitude = req.param('longitude'),
      page = req.param('page_number');

  // temp solution
  var query;
  async.waterfall([
    function(callback){
      var sql = 'SELECT rest_id, rest_name AS name, rest_address AS address, rest_geo_location AS geo_location, rest_pic AS pic, '+
                'rest_pic_thumb AS pic_thumb, rest_google_id AS google_id, rest_google_reference AS google_reference '+
                'FROM restaurants LIMIT ?,?';
      query = connection.query(sql, [(page-1)*PAGING_VALUE,PAGING_VALUE],function(err, result){
        if(err){
          console.log(query.sql);
          callback('error');
        }
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
  }); // end of temp solution

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

router.get('/show/:RESTID', function(req, res) {
  var restaurantId = req.params.RESTID;
  var data, query;
  if (restaurantId != parseInt(restaurantId))
    res.json(400, util.showError('invalid request'));
  else{
    async.waterfall([
      function(callback){
        // check if the RESTID exist or not in database
        query = connection.query('SELECT * FROM restaurants WHERE rest_id = ? LIMIT 1', restaurantId, function(err, restRow) {
          if(err)
            callback('error');
          else {
            if (typeof restRow !== 'undefined' && restRow.length > 0)
              callback(null, restRow[0]);
            else
              callback('not exist');
          }
        });
      },
      function(arg1, callback){
        query = connection.query('SELECT * FROM dishes WHERE d_rest_id = ?', restaurantId, function(err, dishRow) {
          if (err)
            callback('error');
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
              'dishes' : dishRow
            };
            callback(null, data);
          }
        });
      }
    ], function(err, result){
      if(err){
        if(err === 'error')
          res.json(400, util.showError('unexpected error'));
        else if(err === 'not exist')
          res.json(400, util.showError('Restaurant does not exist'));
      }
      else
        res.json(200, result);
    });
  }
});

module.exports = router;
