var PLAINTEXT_MESSAGE       = 0x10; // Plaintext data for info, debug etc
var MESSAGE_ACKNOWLEDGEMENT = 0x11; // Acknowledge a message

var BATTERY                 = 0x20; // Battery state message
var TEMPERATURE             = 0x21; // Temperature message
var HUMIDITY                = 0x22;
var PRESSURE                = 0x23;
var AIR_QUALITY             = 0x24;

var ACCELERATION            = 0x30;
var MAGNETOMETER            = 0x31;
var GYROSCOPE               = 0x32;
var MOVEMENT_DETECTOR       = 0x33;

var MAM                     = 0xE0; //Masked Authethentication Messaging

var plaintext_handler = require('./handlers/plaintext.js');
var acknowledgement_handler = require('./handlers/acknowledgement.js');
var mam_handler = require('./handlers/mam.js');
var unknown_handler = require('./handlers/unknown.js')

function routeRequest(request)
{
  if(!request.destination_endpoint){
    unknown_hander(request)
  }

  switch(request.destination_endpoint){
    case PLAINTEXT_MESSAGE:
      plaintext_handler(request);
      break;

    case MESSAGE_ACKNOWLEDGEMENT:
      acknowledgement_handler(request);
      break;

    case MAM:
      mam_handler(request);
      break;

    default:
      unknonw_handler(request);
      break;
  }

  return 
}

module.exports = function(request) {
  return routeRequest(request);
};
