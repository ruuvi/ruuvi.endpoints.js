/*jshint 
    node: true
 */
"use strict";
var endpoints = {
  RAW_V1:            0x03, // Original broadcast raw data
  RAW_V2:            0x05, // Updated raw format v2
  PLAINTEXT:         0x10, // Plaintext data for info, debug etc

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
  RAW_V1:            require('./handlers/raw1.js'),
  RAW_V2:            require('./handlers/raw2.js'),
  PLAINTEXT:         require('./handlers/plaintext.js'),
  MAM:               require('./handlers/mam.js'),
  MOVEMENT_DETECTOR: require('./handlers/temperature.js'),
  unknown_handler:   require('./handlers/unknown.js')
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
      response = handlers.RAW_V1(request);
      break;
      
  case endpoints.RAW_V2:
      response = handlers.RAW_V2(request);
      break;
  
    case endpoints.PLAINTEXT_MESSAGE:
      response = handlers.PLAINTEXT(request);
      break;
      
    case endpoints.TEMPERATURE:
      response = handlers.TEMPERATURE(request);
      break;

    case endpoints.MAM:
      response = handlers.MAM(request);
      break;

    default:
      response = handlers.unknown_handler(request);
      break;
  }

  return response;
};

/** 
 *  Replace default handler with one from application
 *  Usage: setHandler(getEndpoints().ACCELERATION, handler);
 */
var setHandler = function(endpoint, handler){
  handlers[endpoint] = handler;
};

module.exports = {
  getEndpoints: endpoints,
  setHandler:   setHandler,
  routeRequest: routeRequest
};
