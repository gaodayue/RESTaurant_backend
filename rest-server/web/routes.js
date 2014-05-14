var index   = require('./index');
var admin   = require('./admin');
var manager = require('./manager');
var tables  = require('./tables');
var dishes  = require('./dishes');

module.exports = function (app) {
  app.use('/', index);
  app.use('/admin', admin);
  app.use('/manager', manager);
  app.use('/tables', tables);
  app.use('/dishes', dishes);
}