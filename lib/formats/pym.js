exports.public = {
  add: function(node, value, dom) {
    dom(node.parentNode).switchTag('ASIDE');

    var data = {
      url: value.url
    };

    var div = node.ownerDocument.createElement('div');
    div.setAttribute('data-anthem-component', 'pym_js');
    div.setAttribute('data-anthem-component-data', JSON.stringify(data));
    dom(node).replace(div);

    return div;
  }
};

exports.private = require('./object')('pym_js');
