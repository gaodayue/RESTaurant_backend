var restaurants = require('./restaurants');
var dishes      = require('./dishes');
var invitations = require('./invitations');
var accounts    = require('./accounts');
var orders      = require('./orders');
var tables      = require('./diningtables');
var push        = require('./push');
var coupons     = require('./coupons');

module.exports = function (app) {
  app.use('/api/restaurants', restaurants);
  app.use('/api/dishes', dishes);
  app.use('/api/invitations', invitations);
  app.use('/api/customer/accounts', accounts);
  app.use('/api/orders', orders);
  app.use('/api/tables', tables);
  app.use('/api/push', push);
  app.use('/api/coupons', coupons);
}