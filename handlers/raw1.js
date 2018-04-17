/*jshint 
    node: true
 */
"use strict";


//https://github.com/ruuvi/ruuvi-sensor-protocols
var parseRawRuuvi = function(manufacturerDataBytes){
  //console.log(manufacturerDataBytes);
  let humidityStart      = 1;
  let humidityEnd        = humidityStart+1;
  let temperatureStart   = humidityEnd;
  let temperatureEnd     = temperatureStart+2;
  let pressureStart      = temperatureEnd;
  let pressureEnd        = pressureStart+2;
  let accelerationXStart = pressureEnd;
  let accelerationXEnd   = accelerationXStart+2;
  let accelerationYStart = accelerationXEnd;
  let accelerationYEnd   = accelerationYStart+2;
  let accelerationZStart = accelerationYEnd;
  let accelerationZEnd   = accelerationZStart+2;
  let batteryStart       = accelerationZEnd;
  let batteryEnd         = batteryStart+2;

  let robject = {};

  let humidity = manufacturerDataBytes[humidityStart];
  humidity/= 2; //scale
  robject.humidity = humidity;

  let temperatureBytes = manufacturerDataBytes.slice(temperatureStart, temperatureEnd);
  let temperature = temperatureBytes[0]  //Full degrees
  temperature += temperatureBytes[1]/100.0; //Decimals
  if(temperature > 128){           // Ruuvi format, sign bit + value
    temperature = temperature-128; 
    temperature = 0 - temperature; 
  }
  robject.temperature = temperature;

  let pressureBytes = manufacturerDataBytes.slice(pressureStart, pressureEnd)  // uint16_t pascals
  let pressure = (pressureBytes[0]<<8) + pressureBytes[1];
  pressure += 50000; //Ruuvi format
  robject.pressure = pressure;

  let accelerationBytes = manufacturerDataBytes.slice(accelerationXStart, accelerationXEnd);  // milli-g
  let accelerationX = (accelerationBytes[0]<<8) + accelerationBytes[1];
  if(accelerationX > 32767){ accelerationX -= 65536;}  //two's complement

  accelerationBytes = manufacturerDataBytes.slice(accelerationYStart, accelerationYEnd);  // milli-g
  let accelerationY = (accelerationBytes[0]<<8) + accelerationBytes[1];
  if(accelerationY > 32767){ accelerationY -= 65536;}  //two's complement

  accelerationBytes = manufacturerDataBytes.slice(accelerationZStart, accelerationZEnd);  // milli-g
  let accelerationZ = (accelerationBytes[0]<<8) + accelerationBytes[1];
  if(accelerationZ > 32767){ accelerationZ -= 65536;}  //two's complement

  robject.accelerationX = accelerationX;
  robject.accelerationY = accelerationY;
  robject.accelerationZ = accelerationZ;
  
  let batteryBytes = manufacturerDataBytes.slice(batteryStart, batteryEnd);  // milli volts
  let battery = (batteryBytes[0]<<8) + batteryBytes[1];
  robject.battery = battery;
  robject.destination_endpoint = 3;

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

module.exports = function(request) {
  let robject = {};
  robject.ready = true;
  if(request.payload[0] != 0x03 || request.payload.length < 13){
    console.log("Improperly routed request at raw1");
    console.log('\t' + JSON.stringify(request));
  }
  else {
    let manufacturerDataString = request.payload;
    robject = parseRawRuuvi(manufacturerDataString);
  }
  return robject;
};
