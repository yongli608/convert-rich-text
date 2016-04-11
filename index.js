var Doc = require('./lib/doc');
var setDocument = require('./lib/setDocument');

module.exports = function(delta, formats, options) {
  document = setDocument();
  var doc = new Doc(formats, options);
  for (var i = 0; i < delta.ops.length; i++) {
    doc.writeOp(delta.ops[i]);
  }
  return doc.getHTML();
};
