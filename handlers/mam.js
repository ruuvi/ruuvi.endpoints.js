var MAM_payload = "";
var MAM_root    = "";
var chuncks     = [];

/* https://gist.github.com/taterbase/2784890 */
function bin2string(array){
	var result = "";
	for(var i = 0; i < array.length; ++i){
		result += (String.fromCharCode(array[i]));
	}
	return result;
}

module.exports = function(request) {
  chuncks[request.index] = request.payload;

  if(request.index == 152 && chuncks.length == 153){
    let ii = 0;
    let message = "";
    let root = "";
    for(ii = 0; ii < 148; ii++){
      message += bin2string(chuncks[ii]);
    }
    console.log(message);
    
    for( ; ii < 153; ii++){
      root += bin2string(chuncks[ii]);
    }
    console.log(root);
  }
  //console.log("%d, %d", request.index, chuncks.length)
  return "ok"
};
