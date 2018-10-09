exports.public = {
  add: function(node, value, dom) {
    dom(node.parentNode).switchTag('div');

    var div = node.ownerDocument.createElement('div');
    div.setAttribute('data-anthem-component', value.type + ':' + value.id);
    dom(node).replace(div);

    return div;
  }
};

exports.private = require('./object')('doc');
