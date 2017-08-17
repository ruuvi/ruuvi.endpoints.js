var MAM_payload = "";
var MAM_root    = "";
var chuncks     = [];

module.exports = function(request) {
  chuncks[request.index] = request.payload;
  if(request.index == 147){
    console.log(MAM: %s", chuncks.join("");
  }
  return "ok"
};
