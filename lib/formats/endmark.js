exports.private = {
  type: 'line',
  splitAffinity: 'right',
  add: function(node, value) {
    node.setAttribute('data-endmark', value.toString());
    return node;
  },
  remove: function(node) {
    node.removeAttribute('data-endmark');
    return node;
  },
  value: function(node) {
    return node.dataset.endmark === 'true';
  },
  match: function(node) {
    return node.tagName === 'P' && node.hasAttribute('data-endmark');
  }
};

exports.public = {
  type: 'line',
  add: function(node, value) {
    if (value) {
      node.classList.add('c-end-para');
    }

    return node;
  }
};
