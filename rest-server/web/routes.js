var admin   = require('./admin');
var manager = require('./manager');

module.exports = function (app) {
  app.use('/admin', admin);
  app.use('/manager', manager);
}