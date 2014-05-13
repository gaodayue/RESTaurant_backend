var express = require('express');
var router = express.Router();

var fs = require('fs');
var path = require('path');
var async = require('async');
var multiparty = require('multiparty');
var gm = require('gm');

var config = require('../config');
var util = require('../utils/util');
var db = require('../utils/database');
var connection = db.connection();

// return a list of restaurants
router.get('/', function (req, res) {
  var sql = 'SELECT rest_id, rest_name, rest_address, rest_geo_location, rest_pic, rest_pic_thumb, rest_category, ' +
            'ra_id AS mgr_id, ra_name AS mgr_name ' +
            'FROM restaurants LEFT JOIN restaurant_accounts on rest_owner_id = ra_id ORDER BY rest_id ASC';

  connection.query(sql, function (err, restaurants) {
    if (err) throw err;
    res.render('admin/index', { title: 'RESTaurant Admin Page', restaurants: restaurants });
  });
});

// return detail page of one specific restaurant
router.get('/edit/:rest_id', function (req, res) {
  var rest_id = req.params.rest_id;
  var sql = 'SELECT rest_id, rest_name, rest_address, rest_geo_location, rest_pic, rest_pic_thumb, rest_category, ' +
            'ra_id AS mgr_id, ra_name AS mgr_name ' +
            'FROM restaurants LEFT JOIN restaurant_accounts on rest_owner_id = ra_id ' +
            'WHERE rest_id = ?';

  connection.query(sql, [rest_id], function (err, result) {
    if (err) throw err;
    if (result.length == 0) {
      return res.send(404, 'restaurant not found!');
    }
    var restaurant = result[0];
    res.render('admin/edit', {
      title: 'RESTaurant | ' + restaurant.rest_name,
      restaurant: restaurant
    });
  });
});

// edit information about the specific restaurant
router.post('/edit/:rest_id', function (req, res) {
  var rest_id = req.params.rest_id;

  async.waterfall([
    // 1. parse multipart/form-data input
    function (callback) {
      var form = new multiparty.Form({
        maxFilesSize: 1 * 1024 * 1024,
        uploadDir: config.pic_original_dir
      });
      
      form.parse(req, function(err, fields, files) {
        if (err) return callback(err);
        var restaurant = {
          id: rest_id,
          name: fields.rest_name[0],
          address: fields.rest_addr[0],
          longitude: fields.rest_lng[0],
          latitude: fields.rest_lat[0],
          category: fields.rest_category[0],
          pic: null,
          pic_thumb: null,
          manager: {
            id: fields.mgr_id[0],
            name: fields.mgr_name[0],
            password: fields.mgr_pwd[0]
          }
        };
        return callback(null, restaurant, files);
      });
    },
    // 2. handle file uploading (store both original version and thumbnail version)
    function (restaurant, files, callback) {
      if (files.rest_pic[0].size == 0) {
        return callback(null, restaurant); // pass to the next phase
      }
      var timestamp = new Date().getTime();
      var ext = path.extname(files.rest_pic[0].originalFilename);
      var fname = restaurant.id + '_' + timestamp + ext;

      var temp_pic_path = files.rest_pic[0].path;
      var original_path = path.join(config.pic_original_dir, fname);
      var thumbnail_path = path.join(config.pic_thumbnail_dir, fname);
      
      // create thumbnail
      gm(temp_pic_path)
      .resize(150, 150, '!')
      .noProfile()
      .write(thumbnail_path, function (err) { // save thumbnail
        if (err) return callback(err);
        fs.rename(temp_pic_path, original_path, function (err) {  // save original file
          if (err) return callback(err);
          // up to this point, we have successfully created original&thumbnail file.
          restaurant.pic = '/uploads/restaurants/original/' + fname;
          restaurant.pic_thumb = '/uploads/restaurants/thumbnail/' + fname;
          return callback(null, restaurant);
        });
      });
    },
    // 3. update database (update manager account)
    function (restaurant, callback) {
      // FIXME: should grab a new connection and start transaction here.
      var manager = restaurant.manager;
      // update existing manager account
      if (manager.id) {
        var data = { ra_name: manager.name };
        if (manager.password) {
          data.ra_password = util.createHash(manager.password);
        };

        connection.query('UPDATE restaurant_accounts SET ? WHERE ra_id=?', [data, manager.id], function (err, result) {
          if (err) return callback(err);
          return callback(null, restaurant);
        });
      }
      // no manager id, create a new account if specified input
      else if (manager.name && manager.password) {
        var account = {
          ra_name: manager.name,
          ra_password: util.createHash(manager.password)
        };
        connection.query('INSERT INTO restaurant_accounts SET ?', account, function (err, result) {
          if (err) return callback(err);
          manager.id = result.insertId;
          return callback(null, restaurant);
        });
      }
      // otherwise, skip to next phase
      else {
        return callback(null, restaurant);
      }
      
    },
    // 4. update database (update restaurant info)
    function (restaurant, callback) {
      var data = {
        rest_name: restaurant.name,
        rest_address: restaurant.address,
        rest_category: restaurant.category
      };
      if (restaurant.manager.id) {
        data.rest_owner_id = restaurant.manager.id;
      }
      if (restaurant.pic) {
        data.rest_pic = restaurant.pic;
        data.rest_pic_thumb = restaurant.pic_thumb;
      }

      var sql = 'UPDATE restaurants ' +
                'SET rest_geo_location = GeomFromText(?), ? ' +
                'WHERE rest_id = ?';
      connection.query(sql, ['POINT('+restaurant.longitude+' '+restaurant.latitude+')', data, restaurant.id], function (err, result) {
        if (err) return callback(err);
        return callback(null);
      });
    }
  ],
  function (err, result) {
    if (err) {
      console.error(err);
      res.send(500, 'Opps!');
    }
    res.redirect('/admin');
  });
});


module.exports = router;