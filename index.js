/*jshint 
    node: true,
    esversion: 6
 */
"use strict";
var parser    = require('./parser.js');
var endpoints = require('./endpoints.js');

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
var parse = function(serialBuffer){
  return parser(serialBuffer);
};

/**
 * Takes Ruuvi Standard Message
 * and returns 11-byte long UINT8 array represenstation.
 *
 */
var create = function(message){
  console.log("TODO: handle: " + message);
};

/**
 *  Returns object with key-value pairs of endpoints
 */
var getEndpoints = function(){
  return endpoints.getEndpoints();
};

/**
 *  Returns object with key-value pairs of DSP functions
 */
var getDSPFunctions = function(){
  return endpoints.getDSPFunctions();
};

/**
 *  Parses given data and routes resulting message to appropriate handler.
 *  Example: 
 *  setHandler("ACCELERATION", grapher);
 *  on(data){ 
 *    handle(data); 
 *  };
 */
var handle = function(data){
	let message = parse(data);
	endpoints.routeRequest(message);
};

module.exports = {
  parse:           parse,
  create:          create,
  getEndpoints:    getEndpoints,
  getDSPFunctions: getDSPFunctions,
  handle:          handle
};


