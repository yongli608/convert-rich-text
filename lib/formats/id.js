exports.private = {
  type: 'line',
  attribute: 'id'
};

exports.public = {
  type: 'line',
  add: function(node, value) {
    if (!node.id) {
      node.id = value;
    }
  }
};
