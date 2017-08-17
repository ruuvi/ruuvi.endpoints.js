var handleRequest = require('./endpoints.js')

module.exports = function(request) {
  return handleRequest(request);
};
