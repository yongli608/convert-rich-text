var Doc = require('./doc');

module.exports = function(delta, formats, options) {
  var doc = new Doc(formats, options);
  for (var i = 0; i < delta.ops.length; i++) {
    doc.writeOp(delta.ops[i]);
  }
  return doc.getHTML();
};
