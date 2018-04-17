/*jshint 
    node: true
 */
"use strict";


//https://github.com/ruuvi/ruuvi-sensor-protocols
var parseRawRuuvi = function(manufacturerDataString){
  let humidityStart      = 2;
  let humidityEnd        = humidityStart+2;
  let temperatureStart   = humidityEnd;
  let temperatureEnd     = temperatureStart+4;
  let pressureStart      = temperatureEnd;
  let pressureEnd        = pressureStart+4;
  let accelerationXStart = pressureEnd;
  let accelerationXEnd   = accelerationXStart+4;
  let accelerationYStart = accelerationXEnd;
  let accelerationYEnd   = accelerationYStart+4;
  let accelerationZStart = accelerationYEnd;
  let accelerationZEnd   = accelerationZStart+4;
  let batteryStart       = accelerationZEnd;
  let batteryEnd         = batteryEnd+4;

  let robject = {};

  let humidity = manufacturerDataString.substring(humidityStart, humidityEnd);
  //console.log(humidity);
  humidity = parseInt(humidity, 16);
  humidity/= 2; //scale
  robject.humidity = humidity;

  let temperatureString = manufacturerDataString.substring(temperatureStart, temperatureEnd);
  let temperature = parseInt(temperatureString.substring(0, 2), 16);  //Full degrees
  temperature += parseInt(temperatureString.substring(2, 4), 16)/100; //Decimals
  if(temperature > 128){           // Ruuvi format, sign bit + value
    temperature = temperature-128; 
    temperature = 0 - temperature; 
  }
  robject.temperature = +temperature.toFixed(2); // Round to 2 decimals, format as a number

  let pressure = parseInt(manufacturerDataString.substring(pressureStart, pressureEnd), 16);  // uint16_t pascals
  pressure += 50000; //Ruuvi format
  robject.pressure = pressure;

  let accelerationX = parseInt(manufacturerDataString.substring(accelerationXStart, accelerationXEnd), 16);  // milli-g
  if(accelerationX > 32767){ accelerationX -= 65536;}  //two's complement

  let accelerationY = parseInt(manufacturerDataString.substring(accelerationYStart, accelerationYEnd), 16);  // milli-g
  if(accelerationY > 32767){ accelerationY -= 65536;}  //two's complement

  let accelerationZ = parseInt(manufacturerDataString.substring(accelerationZStart, accelerationZEnd), 16);  // milli-g
  if(accelerationZ > 32767){ accelerationZ -= 65536;}  //two's complement

  robject.accelerationX = accelerationX;
  robject.accelerationY = accelerationY;
  robject.accelerationZ = accelerationZ;
  
  let battery = parseInt(manufacturerDataString.substring(batteryStart, batteryEnd), 16);  // milli volts
  robject.battery = battery;
  robject.destination_endpoint = 5;

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
  if()
  robject.ready = true;

  if(request[0] != 0x05 || request.length < 20){
    console.log("Improperly routed request at raw2");
  }
  else {
    
    robject = parseRawRuuvi(request.payload);
  }
  return robject;
};
