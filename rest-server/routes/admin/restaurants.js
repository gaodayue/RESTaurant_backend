var express = require('express'),
    router = express.Router(),
    iz = require('iz'),
    are = iz.are,
    validators = iz.validators,
    validationRules = require('../../utils/validation_rules'),
    util = require('../../utils/util'),
    db = require('../../utils/database'),
    connection = db.connection(),
    async = require('async'),
    fs = require('fs'),
    gm = require('gm'),
    mkdirp = require('mkdirp'),
    multiparty = require('multiparty');

// all routes in this file begins with "/admin/restaurants"

router.get('/fill', function(req, res) { // this function only serve to fill restaurant from nearby.json file for first time data
  connection.query('SELECT * FROM restaurants', function(err, result){
    if(err) throw err;
    if(util.isArrayNotEmpty(result))
      res.json(500, util.showError('database already filled!'));
    else{
      var file = path.resolve(__dirname + '../../../nearby.json');
      fs.readFile(file, 'utf8', function(err, data) {
        if(err) throw err;
        data = JSON.parse(data);
        var sql = 'INSERT INTO restaurants (rest_google_id, rest_name, rest_address, rest_geo_location) VALUES';
        for(var i in data){
          var location = 'GeomFromText("POINT('+data[i].location.longitude+' '+data[i].location.latitude+')")';
          var tmp = '"' + data[i].id + '","' + data[i].name + '","' + data[i].address + '",' + location;
          sql += '(' + tmp + ')';
          if (i != data.length-1) sql+=',';
        }
        connection.query(sql, function(err, result) {
          if (err) throw err;
          res.send('ok');
        });
      });
    }
  });
});

router.get('/', function(req, res) {
  var query;
  async.waterfall([
    function(callback){
      var sql = 'SELECT rest_id, rest_name AS name, rest_address AS address, rest_geo_location AS geo_location, '+
                'rest_pic AS pic, rest_pic_thumb as pic_thumb, ra_id AS mgr_id, ra_name AS mgr_name '+
                'FROM restaurants LEFT JOIN restaurant_accounts on rest_owner_id = ra_id';
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
                'rest_pic AS pic, rest_pic_thumb AS pic_thumb, ra_id AS mgr_id, ra_name AS mgr_name '+
                'FROM restaurants LEFT JOIN restaurant_accounts on rest_owner_id = ra_id '+
                'WHERE rest_id = ?';
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
  // TODO :  in the cloud server, we run the server in port 80 by using sudo
  // if we create images, the owner will be root
  // can the user bjtu read/write this images?
  var uploadDir = path.resolve(__dirname, '../../uploads/restaurants/');
  var fullDir = uploadDir + '/full/';
  var thumbDir = uploadDir + '/thumb/';
  async.series([
    function(callback){
      mkdirp(fullDir, function (err) {
        if (err) callback('mkdir error');
        else {
          mkdirp(thumbDir, function(err){
            if(err) callback('mkdir error');
            else callback(null);
          })
        }
      });
    },
    function(callback){
      var form = new multiparty.Form({
        'maxFilesSize' : 1 * 1024 * 1024, // 1 MB, default is Infinity
        'uploadDir' : fullDir // The directory for placing file uploads in. You can move them later using fs.rename(). Defaults to os.tmpDir().
      });
      var image, title;
      form.parse(req, function(err, fields, files){
        if(err) {
          callback('form error');
        }
        else {
          var post;
          if (typeof files.r_pic !== 'undefined' && files.r_pic.length > 0){
            var now = new Date().toISOString();
            var tmpPath = files.r_pic[0].path;
            var fullName = fields.r_name[0] + '_' + now + '_' + files.r_pic[0].originalFilename;
            var thumbName = fields.r_name[0] + '_' + now + '_' + 'thumb_' + files.r_pic[0].originalFilename;
            var fullPath = fullDir + fullName;
            var thumbPath = thumbDir + thumbName;
            gm(tmpPath).thumb(150, 150, thumbPath, 80, function(err){
              if(err){
                callback('pic error');
              }
              else {
                fs.renameSync(tmpPath, fullPath, function(err) {
                  if(err) {
                    callback('pic error');
                  }
                });
              }
            });
            post = {
              'r_name' : fields.r_name[0],
              'r_addr' : fields.r_addr[0],
              'r_longitude' : fields.r_longitude[0],
              'r_latitude' : fields.r_latitude[0],
              'r_pic' : '/uploads/restaurants/full/' + fullName,
              'r_pic_thumb' : '/uploads/restaurants/thumb/' + thumbName,
              'r_mgr_name' : fields.r_mgr_name[0], // this is to create restaurant_account
              'r_mgr_pwd' : fields.r_mgr_pwd[0] // this is to create restaurant_account
            };
          }
          else{
            // picture not available from upload
            post = {
              'r_name' : fields.r_name[0],
              'r_addr' : fields.r_addr[0],
              'r_longitude' : fields.r_longitude[0],
              'r_latitude' : fields.r_latitude[0],
              'r_mgr_name' : fields.r_mgr_name[0], // this is to create restaurant_account
              'r_mgr_pwd' : fields.r_mgr_pwd[0] // this is to create restaurant_account
            };
          }
          var rules = are(validationRules.restaurants_rules);
          console.log(post);
          if (!rules.validFor(post)) {
            var invalidFields = rules.getInvalidFields();
            var errorMessage = invalidFields[Object.keys(invalidFields)[0]][0]; // only need to retrieve the last error
            //res.json(400, util.showError(errorMessage));
            callback(err);
          }
          else {
            connection.beginTransaction(function(err) {
              if (err){
                //res.json(400, util.showError('unexpected error'));
                callback('db error');
              }
              else {
                var ra = {
                  'ra_name' : post.r_mgr_name,
                  'ra_password' : util.createHash(post.r_mgr_pwd)
                };
                connection.query('INSERT INTO restaurant_accounts SET ?', ra, function(err, result) {
                  if (err) { 
                    connection.rollback(function() {
                      //res.json(400, util.showError('unexpected error'));
                      callback('db error');
                    });
                  }
                  else {
                    var pic = post.r_pic ? post.r_pic : null;
                    var picThumb = post.r_pic_thumb ? post.r_pic_thumb : null;
                    var data = {
                      'rest_owner_id' : result.insertId,
                      'rest_name' : post.r_name,
                      'rest_address' : post.r_addr,
                      'rest_pic' : pic,
                      'rest_pic_thumb' : picThumb
                    };
                    connection.query('INSERT INTO restaurants SET rest_geo_location = GeomFromText(?), ?', ['POINT('+post.r_longitude+' '+post.r_latitude+')',data], function(err, result) {
                      if (err) { 
                        connection.rollback(function() {
                          //res.json(400, util.showError('unexpected error'));
                          callback('db error');
                        });
                      }  
                      else {
                        connection.commit(function(err) {
                          if (err) { 
                            connection.rollback(function() {
                              //res.json(400, util.showError('unexpected error'));
                              callback('db error');
                            });
                          }
                          else {
                            console.log('success!');
                            //res.json(200, 'ok');
                            callback(null);
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          } // end else
        }
      });// end form parse
    }
  ], function(err, result){
    if(err){
      if(err === 'mkdir error') res.json(500, util.showError('error with first series'));
      else if(err === 'form error') res.json(500, util.showError('error with form data'));
      else if(err === 'pic error') res.json(500, util.showError('error with picture uploading'));
      else if(err === 'db error') res.json(500, util.showError('error with database operation'));
    }
    else
      res.json(200, 'ok');
  });
});

router.post('/update/:RESTID', function(req, res) {
  // TODO : handle picture uploading here
  //var restaurant = req.body;
  var restaurantId = req.params.RESTID;

  /*async.waterfall([
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
        'r_pic_thumb' : restaurant.r_pic_thumb ? restaurant.r_pic_thumb : arg1.rest_pic_thumb,
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
  });*/

  var uploadDir = path.resolve(__dirname, '../../uploads/restaurants/');
  var fullDir = uploadDir + '/full/';
  var thumbDir = uploadDir + '/thumb/';
  async.waterfall([
    function(callback){
      var query = connection.query('SELECT * FROM restaurants WHERE rest_id = ? LIMIT 1', restaurantId, function(err, result){
        if(err)
          callback('db error');
        else {
          if (typeof result !== 'undefined' && result.length > 0)
            callback(null, result[0]);
          else
            callback('not exist');
        }
      });
    },
    function(arg1, callback) { // arg1 : restaurant
      mkdirp(fullDir, function (err) {
        if (err) callback('mkdir error');
        else {
          mkdirp(thumbDir, function(err){
            if(err) callback('mkdir error');
            else callback(null, arg1);
          })
        }
      });
    },
    function(arg1, callback){ // arg1 : restaurant
      var form = new multiparty.Form({
        'maxFilesSize' : 1 * 1024 * 1024, // 1 MB, default is Infinity
        'uploadDir' : fullDir // The directory for placing file uploads in. You can move them later using fs.rename(). Defaults to os.tmpDir().
      });
      var image, title;
      form.parse(req, function(err, fields, files){
        if(err) {
          callback('form error');
        }
        else {
          var post;
          if (typeof files.r_pic !== 'undefined' && files.r_pic.length > 0){
            var now = new Date().toISOString();
            var tmpPath = files.r_pic[0].path;
            var fullName = fields.r_name[0] + '_' + now + '_' + files.r_pic[0].originalFilename;
            var thumbName = fields.r_name[0] + '_' + now + '_' + 'thumb_' + files.r_pic[0].originalFilename;
            var fullPath = fullDir + fullName;
            var thumbPath = thumbDir + thumbName;
            gm(tmpPath).thumb(150, 150, thumbPath, 80, function(err){
              if(err){
                callback('pic error');
              }
              else {
                fs.renameSync(tmpPath, fullPath, function(err) {
                  if(err) {
                    callback('pic error');
                  }
                });
              }
            });
            post = {
              'r_name' : fields.r_name[0] ? fields.r_name[0] : arg1.rest_name,
              'r_addr' : fields.r_addr[0] ? fields.r_addr[0] : arg1.rest_address,
              'r_longitude' : fields.r_longitude[0] ? fields.r_longitude[0] : arg1.rest_geo_location.x,
              'r_latitude' : fields.r_latitude[0] ? fields.r_latitude[0] : arg1.rest_geo_location.y,
              'r_pic' : '/uploads/restaurants/full/' + fullName,
              'r_pic_thumb' : '/uploads/restaurants/thumb/' + thumbName,
              'r_mgr_name' : 'foo', // this is to create restaurant_account
              'r_mgr_pwd' : 'bar' // this is to create restaurant_account
            };
          }
          else{
            // picture not available from upload
            post = {
              'r_name' : fields.r_name[0] ? fields.r_name[0] : arg1.rest_name,
              'r_addr' : fields.r_addr[0] ? fields.r_addr[0] : arg1.rest_address,
              'r_longitude' : fields.r_longitude[0] ? fields.r_longitude[0] : arg1.rest_geo_location.x,
              'r_latitude' : fields.r_latitude[0] ? fields.r_latitude[0] : arg1.rest_geo_location.y,
              'r_pic' : arg1.rest_pic,
              'r_pic_thumb' : arg1.rest_pic_thumb,
              'r_mgr_name' : 'foo', // this is to create restaurant_account
              'r_mgr_pwd' : 'bar' // this is to create restaurant_account
            };
          }
          var rules = are(validationRules.restaurants_rules);
          console.log(post);
          if (!rules.validFor(post)) {
            var invalidFields = rules.getInvalidFields();
            var errorMessage = invalidFields[Object.keys(invalidFields)[0]][0]; // only need to retrieve the last error
            //res.json(400, util.showError(errorMessage));
            callback(err);
          }
          else {
            var data = {
              'rest_id' : restaurantId,
              'rest_name' : post.r_name,
              'rest_address' : post.r_addr,
              'rest_pic' : post.r_pic,// ? post.r_pic : arg1.r_pic,
              'rest_pic_thumb' : post.r_pic_thumb// ? post.r_pic_thumb : arg1.r_pic_thumb
            };
            var sql = 'UPDATE restaurants SET rest_geo_location = GeomFromText(?), ? WHERE rest_id = ?';
            var query = connection.query(sql, ['POINT('+post.r_longitude+' '+post.r_latitude+')', data, restaurantId], function(err, result) {
              if (err) {
                callback('error');
              }
              else {
                callback(null, 'ok');
              }
            });
          } // end else
        }
      });// end form parse
    }
  ], function(err, result){
    if(err){
      if(err === 'mkdir error') res.json(500, util.showError('error with first series'));
      else if(err === 'form error') res.json(500, util.showError('error with form data'));
      else if(err === 'pic error') res.json(500, util.showError('error with picture uploading'));
      else if(err === 'db error') res.json(500, util.showError('error with database operation'));
      else if(err === 'not exports') res.json(400, util.showError('Restaurant does not exist'));
    }
    else
      res.json(200, 'ok');
  });
});

module.exports = router;
