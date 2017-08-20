var MAM_payload = "";
var MAM_root    = "";
var chunks      = [];
var num_chunks  = 0;
var crc         = 0;

/* https://gist.github.com/taterbase/2784890 */
function bin2string(array){
	var result = "";
	for(var i = 0; i < array.length; ++i){
		result += (String.fromCharCode(array[i]));
	}
	return result;
}

module.exports = function(request) {
  chunks[request.index] = request.payload;
  //Header block
  if(request.index == 255)
  {
    num_chunks = request.payload[0];
    crc = request.payload[1];
  }
  if(request.index == num_chunks-1){
    let ii = 0;
    let message = "";
    let root = "";
    console.log("Reguest: %d, length: %d, %s, ", request.index, request.payload.length, request.payload);
    //console.log(chunks[ii]);
    for(ii = 0; ii < num_chunks; ii++){
      message += bin2string(chunks[ii]);
    }
    console.log(message);
    
  }
  //console.log("%d, %d", request.index, request.payload.length)
  return "ok"
};
