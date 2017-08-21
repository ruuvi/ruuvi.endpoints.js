var PLAINTEXT_MESSAGE       = 0x10; // Plaintext data for info, debug etc
var MESSAGE_ACKNOWLEDGEMENT = 0x11; // Acknowledge a message

var BATTERY                 = 0x30; // Battery state message
var TEMPERATURE             = 0x31; // Temperature message
var HUMIDITY                = 0x32;
var PRESSURE                = 0x33;
var AIR_QUALITY             = 0x34;

var ACCELERATION            = 0x40;
var MAGNETOMETER            = 0x41;
var GYROSCOPE               = 0x42;
var MOVEMENT_DETECTOR       = 0x33;

var MAM                     = 0xE0; //Masked Authethentication Messaging

var plaintext_handler = require('./handlers/plaintext.js');
var acknowledgement_handler = require('./handlers/acknowledgement.js');
var mam_handler = require('./handlers/mam.js');
var unknown_handler = require('./handlers/unknown.js')

function routeRequest(request)
{
  let response = {};
  response.ready = false;
  if(!request.destination_endpoint){
    response = unknown_hander(request)
  }

  switch(request.destination_endpoint){
    case PLAINTEXT_MESSAGE:
      response = plaintext_handler(request);
      break;

    case MESSAGE_ACKNOWLEDGEMENT:
      response = acknowledgement_handler(request);
      break;

    case MAM:
      response = mam_handler(request);
      break;

    default:
      response = unknown_handler(request);
      break;
  }

  return response;
}

module.exports = function(request) {
  return routeRequest(request);
};
