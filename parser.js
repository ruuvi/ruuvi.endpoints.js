var parseStandardMsg = function(request, data){
  request.source_endpoint = data[1];
  request.type = data[2];
  request.payload = data.slice(3, 12);
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
