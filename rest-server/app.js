var express = require('express');
var path = require('path');
var async = require('async');
var mkdirp = require('mkdirp');
var config = require('./config');
var util = require('./utils/util');
var api_routes = require('./api/routes');
var web_routes = require('./web/routes');

// 3rd-party middlewares
var logger        = require('morgan');
var cookieParser  = require('cookie-parser');
var session       = require('express-session');
var bodyParser    = require('body-parser');
var passport      = require('passport');
var BearerStrategy= require('passport-http-bearer').Strategy;
var jwt           = require('jwt-simple');
var redis         = require('redis');
var redisClient   = redis.createClient();

var app = express();

// passport
passport.use(new BearerStrategy({
  },
  function(token, done) {
    // asynchronous validation, for effect...
    process.nextTick(function () {
      
      //var data = jwt.decode(token, config.jwt_secret);
      var data;
      try {
        data = jwt.decode(token, config.jwt_secret);
      }
      catch (e) {
        console.log('invalid token');
        return done(null, false);
      }
      redisClient.get('cust:'+data.cust_id, function (err, result) {
        if (err)
          return done(err);
          //res.json(500, util.showError('internal server error'));
        else {
          if (result === null)
            return done(null, false);
            //res.json(401, {result : 'error', error_message : 'unauthorized'});
          else {
            if (result === data.token) {
              var user = {cust_id: data.cust_id};
              return done(null, user/*, {scope: '*'}*/);
              //res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
              //next();
            }
            else 
              return done(null, false);
              //res.json(401, {result : 'error', error_message : 'unauthorized'});
          }
        }
      });
    });
  }
));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({
  secret: config.session_secret
}));
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

api_routes(app);
web_routes(app);

// error handlers
app.use(function (err, req, res, next) {
  if (req.xhr) {
    console.error(err.stack);
    res.send(500, util.showError('unexpected error'));
  } else {
    next(err);
  }
});

app.use(function (err, req, res, next) {
  if (err) {
    console.error(err.stack);
    res.send(500, 'Something broke!');
  }
});

// create folders for uploaded file
async.series([
  function (callback) {
    mkdirp(config.pic_original_dir, function (err) {
      if (err) return callback(err);
      callback(null);
    });
  },
  function (callback) {
    mkdirp(config.pic_thumbnail_dir, function (err) {
      if (err) return callback(err);
      callback(null);
    });
  }
],
function (err, results) {
  if (err) throw err;
});

module.exports = app;