/*jshint 
    node: true
 */
"use strict";
var endpoints = {
  RAW_V1:            0x03, // Original broadcast raw data
  RAW_V2:            0x05, // Updated raw format v2
  PLAINTEXT_MESSAGE: 0x10, // Plaintext data for info, debug etc

  BATTERY:           0x30, // Battery state message
  TEMPERATURE:       0x31, // Temperature message
  HUMIDITY:          0x32,
  PRESSURE:          0x33,
  AIR_QUALITY:       0x34,

  ACCELERATION:      0x40,
  MAGNETOMETER:      0x41,
  GYROSCOPE:         0x42,
  MOVEMENT_DETECTOR: 0x33,

  MAM:               0xE0  //Masked Authethentication Messaging
};

/**
 *  Handlers for incoming messages. Default handler prints message to console.
 *  TODO: Default handler returns object with the key-value pairs
 *  Set these to your application handlers as needed
 */
var handlers = {
  raw1_handler:        require('./handlers/raw1.js'),
  raw2_handler:        require('./handlers/raw2.js'),
  plaintext_handler:   require('./handlers/plaintext.js'),
  mam_handler:         require('./handlers/mam.js');
  temperature_handler: require('./handlers/temperature.js');
  unknown_handler:     require('./handlers/unknown.js');
};

var routeRequest = function (request)
{
  let response = {};
  response.ready = false;
  if(!request.destination_endpoint){
    response = unknown_handler(request);
  }

  switch(request.destination_endpoint){
  case endpoints.RAW_V1:
      response = raw1_handler(request);
      break;
      
  case endpoints.RAW_V2:
      response = raw2_handler(request);
      break;
  
    case endpoints.PLAINTEXT_MESSAGE:
      response = plaintext_handler(request);
      break;
      
    case endpoints.TEMPERATURE:
      response = temperature_handler(request);
      break;

    case endpoints.MAM:
      response = mam_handler(request);
      break;

    default:
      response = unknown_handler(request);
      break;
  }

  return response;
};

/** 
 *  Replace default handler with one from application
 *  Usage: setHandler("ACCELERATION", handler);
 */
var setHandler = function(endpoint, handler){
  handlers[endpoint] = handler;
};

module.exports = {
  getEndpoints: endpoints,
  setHandler:   setHandler,
  routeRequest: routeRequest
};
