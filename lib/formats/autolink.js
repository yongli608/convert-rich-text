var addLink = require('./link').public.add;

exports.private = {
  add: function(node, value, dom) {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      var span = node.ownerDocument.createElement('span');
      dom(node).wrap(span);
      node = span;
    }
    node.setAttribute('data-autolink-id', value.id);
    node.setAttribute('data-autolink-href', value.href);
    if (value.disabled) {
      node.setAttribute('data-autolink-disabled', '');
    } else {
      node.removeAttribute('data-autolink-disabled');
    }
    return node;
  },
  remove: function(node) {
    node.removeAttribute('data-autolink-id');
    node.removeAttribute('data-autolink-href');
    node.removeAttribute('data-autolink-disabled');
    return node;
  },
  value: function(node) {
    return {
      id: node.getAttribute('data-autolink-id'),
      href: node.getAttribute('data-autolink-href'),
      disabled: node.hasAttribute('data-autolink-disabled')
    };
  },
  match: function(node) {
    return node.hasAttribute('data-autolink-id');
  }
};

exports.public = {
  add: function(node, value, dom) {
    if (!value.disabled) {
      node = addLink(node, value.href, dom);
    }

    return node;
  }
};
