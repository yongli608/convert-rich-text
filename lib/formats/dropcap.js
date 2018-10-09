exports.private = {
  type: 'line',
  splitAffinity: 'left',
  add: function(node, value) {
    node.setAttribute('data-dropcap', value.toString());
    return node;
  },
  remove: function(node) {
    node.removeAttribute('data-dropcap');
    return node;
  },
  value: function(node) {
    return node.dataset.dropcap === 'true';
  },
  match: function(node) {
    return node.tagName === 'P' && node.hasAttribute('data-dropcap');
  }
};

exports.public = {
  type: 'line',
  add: function(node, value) {
    if (value) {
      node.classList.add('p-dropcap');
      node.classList.add('has-dropcap');
    }

    return node;
  }
};
