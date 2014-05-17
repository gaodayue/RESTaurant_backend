var index   = require('./index');
var orders  = require('./orders');
var admin   = require('./admin');
var manager = require('./manager');
var tables  = require('./tables');
var dishes  = require('./dishes');
var coupons = require('./coupons');

module.exports = function (app) {
  app.use('/', index);
  app.use('/orders', orders);
  app.use('/admin', admin);
  app.use('/manager', manager);
  app.use('/tables', tables);
  app.use('/dishes', dishes);
  app.use('/coupons', coupons);
}