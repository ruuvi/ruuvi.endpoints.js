/*jshint 
    node: true
 */
"use strict";
var PLAINTEXT_MESSAGE       = 0x10; // Plaintext data for info, debug etc

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
var mam_handler = require('./handlers/mam.js');
var temperature_handler = require('./handlers/temperature.js');
var unknown_handler = require('./handlers/unknown.js');

function routeRequest(request)
{
  let response = {};
  response.ready = false;
  if(!request.destination_endpoint){
    response = unknown_handler(request);
  }

  switch(request.destination_endpoint){
    case PLAINTEXT_MESSAGE:
      response = plaintext_handler(request);
      break;
      
    case TEMPERATURE:
      response = temperature_handler(request);
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

module.exports.route = function(request) {
  return routeRequest(request);
};
