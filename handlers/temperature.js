module.exports = function(request) {
  console.log(bin2String(request.payload));
  return "ok"
};
