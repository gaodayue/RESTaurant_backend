var restaurants = require('./routes/restaurants');
var dishes = require('./routes/dishes');
var invitations = require('./routes/invitations');
var accounts = require('./routes/accounts');
var orders = require('./routes/orders');
var tables = require('./routes/diningtables');
var push = require('./routes/push');
var coupons = require('./routes/coupons');

var admin = require('./routes/admin');
var manager = require('./routes/manager');

module.exports = function (app) {
  app.use('/api/restaurants', restaurants);
  app.use('/api/dishes', dishes);
  app.use('/api/invitations', invitations);
  app.use('/api/customer/accounts', accounts);
  app.use('/api/orders', orders);
  app.use('/api/tables', tables);
  app.use('/api/push', push);
  app.use('/api/coupons', coupons);

  app.use('/admin', admin);
  app.use('/manager', manager);
};