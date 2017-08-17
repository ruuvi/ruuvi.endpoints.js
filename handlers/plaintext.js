/* https://stackoverflow.com/questions/3195865/converting-byte-array-to-string-in-javascript */
function bin2String(array) {
  var result = "";
  for (var i = 0; i < array.length; i++) {
    result += String.fromCharCode(array[i]);
  }
  return result;
}

module.exports = function(request) {
  console.log(bin2String(request.payload));
  return "ok"
};
