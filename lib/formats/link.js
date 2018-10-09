exports.private = {
  tag: 'A',
  add: function(node, value) {
    node.setAttribute('href', value);
    return node;
  },
  remove: function(node) {
    node.removeAttribute('href');
    return node;
  },
  value: function(node) {
    return node.getAttribute('href');
  }
};

exports.public = {
  add: function(node, value, dom) {
    var link = node.ownerDocument.createElement('a');
    dom(node).wrap(link);
    node = link;
    node.href = value;
    var previous = node.previousSibling;
    if (previous && previous.tagName === 'A' && previous.href === node.href) {
      node = dom(previous).merge(node).get();
    }
    return node;
  }
};
