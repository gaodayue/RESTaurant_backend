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

router.get('/', function(req, res){
  var restaurantId = req.param('r_id');
  if(!restaurantId)
    res.json(400, util.showError('missing restaurant ID'));
  else {
    async.waterfall([
      function(callback){
        var query = connection.query('SELECT * FROM dining_tables WHERE tbl_rest_id = ?', restaurantId, function(err, result){
          if(err)
            callback('error');
          else {
            if(typeof result !== 'undefined' && result.length > 0){
              var data = [];
              for(var i in result){
                var t = {
                  'tbl_id' : result[i].tbl_id,
                  'capacity' : result[i].tbl_capacity
                };
                data.push(t);
              }
              callback(null, data);
            }
            else
              callback('not exist');
          }
        });
      }
    ], function(err, result){
      if(err){
          if(err === 'error')
            res.json(400, util.showError('unexpected error'));
          else
            res.json(400, util.showError(err));
        }
        else {
          res.json(200, result);
        }
    });
  }
});

router.post('/create', function(req, res){
  var num = req.body.num;
  var capacity = req.body.capacity;
  var restaurantId = req.body.r_id;
  if(!restaurantId)
    res.json(400, util.showError('missing restaurant ID'));
  else if(!num)
    res.json(400, util.showError('missing number of table'));
  else if(!capacity)
    res.json(400, util.showError('missing table capacity'));
  else {
    async.waterfall([
      function(callback){
        var data = [];
        for (var i = 0; i < num; i++){ // creating array for bulk insert
          // tbl_rest_id, tbl_capacity, tbl_display_order
          var a = [restaurantId, capacity, 0];
          data.push(a);
        }
        query = connection.query('INSERT INTO dining_tables (tbl_rest_id, tbl_capacity, tbl_display_order) VALUES ?', [data], function(err, result){
          if(err)
            callback('error');
          else{
            callback(null, 'ok');
          }
        });
      }
    ], function(err, result){
        if(err){
          if(err === 'error')
            res.json(400, util.showError('unexpected error'));
          else
            res.json(400, util.showError(err));
        }
        else {
          res.json(200, result);
        }
    });
  } 
});

router.post('/delete/:TBLID', function(req, res){
  var tableId = req.params.TBLID;
  var restaurantId = req.body.r_id;
  if(!restaurantId)
    res.json(400, util.showError('missing restaurant ID'));
  if(!tableId)
    res.json(400, util.showError('missing table ID'));
  else {
    async.waterfall([
      function(callback){
        query = connection.query('DELETE FROM dining_tables WHERE tbl_id = ? AND tbl_rest_id = ?', [tableId, restaurantId], function(err, result){
          if(err)
            callback('error');
          else{
            callback(null, 'ok');
          }
        });
      }
    ], function(err, result){
        if(err){
          if(err === 'error')
            res.json(400, util.showError('unexpected error'));
          else
            res.json(400, util.showError(err));
        }
        else {
          res.json(200, result);
        }
    });
  }
});

router.post('/reorder', function(req, res){
  // TODO : WORK ON IT!
  var order = req.body.order.split('|'); // new order of table id joined by '|'
  var restaurantId = req.body.r_id;
  if(!restaurantId)
    res.json(400, util.showError('missing restaurant ID'));
  else {
    
  }
});

module.exports = router;