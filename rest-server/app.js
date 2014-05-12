var express = require('express');
var path = require('path');
var async = require('async');
var mkdirp = require('mkdirp');
var config = require('./config');
var routes = require('./routes');

// 3rd-party middlewares
var logger        = require('morgan');
var cookieParser  = require('cookie-parser');
var session       = require('express-session');
var bodyParser    = require('body-parser');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({
  secret: config.session_secret,
  cookie: { secure: true }
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

routes(app);

// error handlers
app.use(function (err, req, res, next) {
  if (req.xhr) {
    res.send(500, { error: 'Something blew up!' });
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