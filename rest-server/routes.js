var restaurants = require('./routes/restaurants');
var dishes = require('./routes/dishes');
var invitations = require('./routes/invitations');
var accounts = require('./routes/accounts');
var orders = require('./routes/orders');
//var adminRestaurants = require('./routes/admin/restaurants'); // we don't need this anymore
var tables = require('./routes/diningtables');
var push = require('./routes/push');

var admin = require('./routes/admin');
var manager = require('./routes/manager');

module.exports = function (app) {
  app.use('/api/restaurants', restaurants);
  app.use('/api/dishes', dishes);
  app.use('/api/invitations', invitations);
  app.use('/api/customer/accounts', accounts);
  app.use('/api/orders', orders);
  //app.use('/api/admin/restaurants', adminRestaurants);
  app.use('/api/tables', tables);
  app.use('/api/push', push);

  app.use('/admin', admin);
  app.use('/manager', manager);
};