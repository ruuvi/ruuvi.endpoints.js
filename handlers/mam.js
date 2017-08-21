var chunks      = [];
var num_chunks  = 0;
var crc         = 0;
var MAM         = {};

/* https://gist.github.com/taterbase/2784890 */
function bin2string(array){
	var result = "";
	for(var i = 0; i < array.length; ++i){
		result += (String.fromCharCode(array[i]));
	}
	return result;
}

/* https://stackoverflow.com/questions/33702838/how-to-append-bytes-multi-bytes-and-buffer-to-arraybuffer-in-javascript */
function concatTypedArrays(a, b) { // a, b TypedArray of same type
    var c = new (a.constructor)(a.length + b.length);
    c.set(a, 0);
    c.set(b, a.length);
    return c;
}

function concatBuffers(a, b) {
    return concatTypedArrays(
        new Uint8Array(a.buffer || a), 
        new Uint8Array(b.buffer || b)
    ).buffer;
}

module.exports = function(request) {
  chunks[request.index] = request.payload;
  //Header block
  if(request.index == 255)
  {
    num_chunks = request.payload[0];
    crc = request.payload[1];
    MAM.ready = false;
    MAM.binary = new Uint8Array(); 
    console.log("Starting MAM receive, expecting %d chunks", num_chunks);
  }
  if(request.index == num_chunks-1){
    let ii = 0;
    let message = "";
    let root = "";
    console.log("Request: %d, length: %d, MAM complete ", request.index, request.payload.length);
    for(ii = 0; ii < num_chunks; ii++){
      // This could be done more effectively
      MAM.binary = concatBuffers(MAM.binary, chunks[ii]);
    }
    MAM.ready = true;
    
  }
  return MAM;
};
