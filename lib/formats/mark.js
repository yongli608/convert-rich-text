exports.public = {
  add: function(node, value, dom) {
    var blank = node.ownerDocument.createTextNode('');
    dom(node).replace(blank);
    return blank;
  }
};

exports.private = { tag: 'MARK' };
