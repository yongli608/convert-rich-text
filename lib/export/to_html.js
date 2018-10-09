var Doc = require('../doc');

module.exports = function(delta, formats, options) {
  if (delta == null) {
    return '';
  }
  var doc = new Doc(formats, options);
  for (var i = 0; i < delta.ops.length; i++) {
    doc.writeOp(delta.ops[i]);
  }
  return doc.getHTML()
    .replace(/<br><\/(p|li|h[1-6])><\1[^>]*?>/ig, '<br>')
    .replace(/<br><\//ig, '</');
};
