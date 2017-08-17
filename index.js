var handleRequest = require('./endpoints.js')
var parser        = require('./parser.js')

module.exports = function(serialBuffer) {
  request = parser(serialBuffer);
  return handleRequest(request);
};
