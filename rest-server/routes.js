var restaurants = require('./routes/restaurants');
var dishes = require('./routes/dishes');
var invitations = require('./routes/invitations');
var accounts = require('./routes/accounts');
var orders = require('./routes/orders');
var adminRestaurants = require('./routes/admin/restaurants');
var tables = require('./routes/diningtables');
var push = require('./routes/push');

var admin = require('./routes/admin');
var manager = require('./routes/manager');

module.exports = function (app) {
  app.use('/restaurants', restaurants);
  app.use('/dishes', dishes);
  app.use('/invitations', invitations);
  app.use('/customer/accounts', accounts);
  app.use('/orders', orders);
  app.use('/admin/restaurants', adminRestaurants);
  app.use('/tables', tables);
  app.use('/push', push);

  app.use('/admin', admin);
  app.use('/manager', manager);
};