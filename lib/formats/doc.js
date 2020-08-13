exports.public = {
  add: function(node, value, dom) {
    dom(node.parentNode).switchTag('div');

    var div = node.ownerDocument.createElement('div');
    div.setAttribute('data-anthem-component', value.type + ':' + value.id);
    if (value.product && value.product.layout) {
      div.setAttribute('data-component-layout', value.product.layout);
    }
    dom(node).replace(div);

    return div;
  }
};

exports.private = require('./object')('doc');
