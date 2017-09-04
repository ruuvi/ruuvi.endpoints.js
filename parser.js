"use strict;"

let types = {
  SENSOR_CONFIGURATION:  0x01, // Configure sensor
  ACTUATOR_CONFIGRATION: 0x02, // Configure actuator
  ACKNOWLEDGEMENT:       0x03, // Acknowledge message
  STATUS_QUERY:          0x04, // Query status from endpoint - returns current configuration
  DATA_QUERY:            0x05, // Query data from endpoint - returns latest data
  LOG_QUERY:             0x06, // Query log from endpoint - initiates bulk write
  CAPABILITY_QUERY:      0x07, // Query endpoint capablities: samplerate, resolution, scale, log, power consumption with settings given in query
  SAMPLERATE_RESPONSE:   0x08,
  RESOLUTION_RESPONSE:   0x09,
  SCALE_RESPONSE:        0x10,
  LOG_RESPONSE:          0x11,
  POWER_RESPONSE:        0x12,
  TIMESTAMP:             0x13,
  UNKNOWN:               0x14,
  ERROR:                 0x15,
  UINT8:                 0x80, // Array of uint8
  INT8:                  0x81,
  UINT16:                0x82,
  INT16:                 0x83,
  UINT32:                0x84,
  INT32:                 0x85,
  UINT64:                0x86, // Single uint64
  INT64:                 0x87,
  ASCII:                 0x88  // ASCII array
}

/** 
 *  Parses given request payload into object.
 **/
let parseType = function(request, data)
{
    switch(request.type){
      case types.SENSOR_CONFIGURATION:
        request.payload.sample_rate = data[3];
        request.payload.transmission_rate = data[4];
        request.payload.resolution = data[5];
        request.payload.scale = data[6];
        request.payload.dsp_function = data[7];
        request.payload.dsp_parameter = data[8];
        request.payload.target = data[9];
        request.payload.reserved = data[10];
        break;
      case UINT8:
        request.payload.values = [];
        request.payload.values[0] = data[3];
        request.payload.values[1] = data[4];
        request.payload.values[2] = data[5];
        request.payload.values[3] = data[6];
        request.payload.values[4] = data[7];
        request.payload.values[5] = data[8];
        request.payload.values[6] = data[9];
        request.payload.values[7] = data[10];
      case INT8:
        valueArray = new Int8Array(data, 3]);
        request.payload.values = [];
        request.payload.values[0] = valueArray[0];
        request.payload.values[1] = valueArray[1];
        request.payload.values[2] = valueArray[2];
        request.payload.values[3] = valueArray[3];
        request.payload.values[4] = valueArray[4];
        request.payload.values[5] = valueArray[5];
        request.payload.values[6] = valueArray[6];
        request.payload.values[7] = valueArray[7];
        break;
      case UINT16:
        valueArray = new Uint16Array(data, 3]);
        request.payload.values = [];
        request.payload.values[0] = valueArray[0];
        request.payload.values[1] = valueArray[1];
        request.payload.values[2] = valueArray[2];
        request.payload.values[3] = valueArray[3];
        break;
      case INT16:
        valueArray = new Int16Array(data, 3]);
        request.payload.values = [];
        request.payload.values[0] = valueArray[0];
        request.payload.values[1] = valueArray[1];
        request.payload.values[2] = valueArray[2];
        request.payload.values[3] = valueArray[3];
        break;
      case UINT32:
        valueArray = new Uint32Array(data, 3]);
        request.payload.values = [];
        request.payload.values[0] = valueArray[0];
        request.payload.values[1] = valueArray[1];
        break;
      case INT32:
        valueArray = new Int32Array(data, 3]);
        request.payload.values = [];
        request.payload.values[0] = valueArray[0];
        request.payload.values[1] = valueArray[1];
        break;
      case UINT64:
        valueArray = new Uint64Array(data, 3]);
        request.payload.values = [];
        request.payload.values[0] = valueArray[0];
        break;
      case INT64:
        valueArray = new Int64Array(data, 3]);
        request.payload.values = [];
        request.payload.values[0] = valueArray[0];
        break;
    }
}

let parseStandardMsg = function(request, data){
  request.source_endpoint = data[1];
  request.type = data[2];
  parseType(request, data);
}

/** Take raw uint8_t array from RuuviTag and parse it to a request object**/
module.exports = function(payload) {
  data = new Uint8Array(payload);
  request = {};
  request.destination_endpoint = data[0];
  if(request.destination_endpoint < 0xE0){
    parseStandardMsg(request, data);
  }
  else {
    request.index = data[1];
    request.payload = data.slice(2, data.length);
  }
  return request;
};