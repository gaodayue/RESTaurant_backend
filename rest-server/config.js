path = require('path');

module.exports = {
  server: {
    listenPort: 80,
    distFolder: path.resolve(__dirname, '../rest-client')
  }
};