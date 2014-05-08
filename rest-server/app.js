var express = require('express');
var config = require('./config');
// 3rd-party middlewares
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// custom middlewares
var restaurants = require('./routes/restaurants');
var dishes = require('./routes/dishes');
var invitations = require('./routes/invitations');
var accounts = require('./routes/accounts');
var orders = require('./routes/orders');
var adminRestaurants = require('./routes/admin/restaurants');
var tables = require('./routes/diningtables');

var app = express();

app.use(express.static(config.server.distFolder));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

app.use('/restaurants', restaurants);
app.use('/dishes', dishes);
app.use('/invitations', invitations);
app.use('/customer/accounts', accounts);
app.use('/orders', orders);
app.use('/admin/restaurants', adminRestaurants);
app.use('/tables', tables);

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

module.exports = app;