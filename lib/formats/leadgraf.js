exports.private = {
  type: 'line',
  splitAffinity: 'left',
  add: function(node, value) {
    node.setAttribute('data-leadgraf', value.toString());
    return node;
  },
  remove: function(node) {
    node.removeAttribute('data-leadgraf');
    return node;
  },
  value: function(node) {
    return node.dataset.leadgraf === 'true';
  },
  match: function(node) {
    return node.tagName === 'P' && node.hasAttribute('data-leadgraf');
  }
};

exports.public = {
  type: 'line',
  add: function(node, value) {
    if (value) {
      node.classList.add('p-large-text');
    }

    return node;
  }
};
