exports.private = {
  type: 'line',
  reverseMerge: true,
  add: function(node) {
    node.classList.add('soft-break');
    return node;
  },
  remove: function(node) {
    node.classList.remove('soft-break');
    return node;
  },
  value: function(node) {
    return node.classList.contains('soft-break');
  },
  match: function(node) {
    return node.classList.contains('soft-break');
  }
};

// All lines that end with a line-break will end with a <br> tag. `to_unison_html`
// post-processing will strip out extra <p> tags b/t lines after the fact.
//
// Ex. <p>Hello<br></p><p>world!</p> => <p>Hello<br>world!</p>
exports.public = {
  type: 'line',
  add: function(node) {
    var br = node.ownerDocument.createElement('br');
    node.appendChild(br);

    return node;
  }
};
