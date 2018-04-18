/*jshint 
 *node: true
 */
"use strict";

//TODO: Refactor into utils
function toHexString(byteArray) {
  return Array.from(byteArray, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}


//https://github.com/ruuvi/ruuvi-sensor-protocols
var parseRawRuuvi = function(manufacturerDataString){

  let robject = {};
  let data = manufacturerDataString;
  let dataFormat = data[0] & 0xFF;
  let temperature = (data[1] << 8 | data[2] & 0xFF) / 200d;
  let humidity =  ((data[3] & 0xFF) << 8 | data[4] & 0xFF) / 400d;
  let pressure = (double) ((data[5] & 0xFF) << 8 | data[6] & 0xFF) + 50000;
  let accelerationX = (data[7] << 8 | data[8] & 0xFF) / 1000d;
  let accelerationY = (data[9] << 8 | data[10] & 0xFF) / 1000d;
  let accelerationZ = (data[11] << 8 | data[12] & 0xFF) / 1000d;
  let powerInfo = (data[13] & 0xFF) << 8 | data[14] & 0xFF;
  let batteryVoltage = (powerInfo >>> 5) / 1000d + 1.6d;
  let txPower = (powerInfo & 0b11111) * 2 - 40;
  let movementCounter = data[15] & 0xFF;
  let measurementSequenceNumber = (data[16] & 0xFF) << 8 | data[17] & 0xFF;
  let mac = toHexString(data.subarray(18));

  robject.destination_endpoint = dataFormat;
  robject.temperature = temperature;
  robject.humidity = humidity;
  robject.pressure = pressure;
  robject.accelerationX = accelerationX;
  robject.accelerationY = accelerationY;
  robject.accelerationZ = accelerationZ;
  robject.batteryVoltage = batteryVoltage;
  robject.txPower = txPower;
  robject.movementCounter = movementCounter;
  robject.measurementSequenceNumber = measurementSequenceNumber;
  robject.mac = mac;

  return robject;
}

/** 
 * Parse incoming binary array with [raw format 1](https://github.com/ruuvi/ruuvi-sensor-protocols)
 *
 * Return object which has temperature (C), humidity (RH-%), pressure (Pa), acceleration x, y, z (mg), battery voltage (mV)
 *
 * @param request binary array payload. return error if first byte is not 0x03. Any communication layer specific metadata should be stripped.
 * @return object with ready = true if success, ready = false on failure.
 * 
 */

// XXX not supported yet
module.exports = function(request) {
  let robject = {};
  //if() TODO request type check
  robject.ready = true;

  if(request[0] != 0x05 || request.length < 24){
    console.log("Improperly routed request at raw2");
  }
  else {

    robject = parseRawRuuvi(request.payload);
  }
  return robject;
};
