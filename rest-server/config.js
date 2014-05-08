path = require('path');

module.exports = {
  server: {
    listenPort: 8888,
    distFolder: path.resolve(__dirname, '../rest-client')
  }
};