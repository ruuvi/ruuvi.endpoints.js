var handleRequest = require('./endpoints.js')
var parser        = require('./parser.js')

/**
 *  Takes UINT8_T array with 11 bytes as input
 *  Request Ruuvi Standard Message Object as output,
 *  usage: 
 *  let message = parseRuuviStandardMessage(buffer);
 *  message.source_endpoint
 *  message.destination_endpoint
 *  message.type
 *  message.payload.sample_rate
 *  message.payload.transmission_rate  
 *  // and so on. Payload fields are dependend on type.
 **/
let parse = function(serialBuffer){
  return parser(serialBuffer);	
} 

/**
 * Takes Ruuvi Standard Message
 * and returns 11-byte long UINT8 array represenstation.
 *
 */
let create = function(message){
  console.log("TODO");
}

module.exports = {
  parse: parse,
  create: create
};


