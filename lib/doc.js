var dom = require('./dom');
var intersection = require('lodash').intersection;

module.exports = Doc;

function Doc(formats, options) {
  this.formats = formats;
  this.document = options.document;
  this.blockTag = options && options.blockTag || 'div';
  this.inlineTag = options && options.inlineTag || 'span';
  this.formatOrder = options && options.formatOrder || Object.keys(this.formats);
  this.root = this.document.createElement('div');
}

Doc.prototype.getHTML = function() {
  return this.root.innerHTML;
};

Doc.prototype.writeOp = function(op) {
  if (op.insert === null || op.insert === undefined) {
    throw new Error('Cannot convert delta with non-insert operations');
  }

  var attrs = op.attributes || {};
  var text = (typeof op.insert === 'string') ?
    op.insert.replace(/\r\n?/g, '\n') : '!';
  var index = text.indexOf('\n');

  while (index >= 0) {
    this.writeText(text.slice(0, index), attrs);
    this.formatLine(attrs);
    this.line = null;
    text = text.slice(index + 1);
    index = text.indexOf('\n');
  }

  if (text.length > 0) {
    this.writeText(text, attrs);
  }

  return this;
};

Doc.prototype.writeText = function(text, attrs) {
  if (!this.line) {
    this.line = this.document.createElement(this.blockTag);
    this.root.appendChild(this.line);
  }

  if (!text.length) { return }

  var node = this.document.createTextNode(text);

  this.line.appendChild(node);

  // TODO: each format function returns a promise
  var self = this;
  intersection(this.formatOrder, Object.keys(attrs)).forEach(function(name) {
    var format = self.formats[name];
    if (format && format.type !== 'line') {
      node = self.applyFormat(node, format, attrs[name]);
    }
  });

  // TODO: optimize line?
  this.line = this.root.lastChild;
};

Doc.prototype.applyFormat = function(node, format, value) {
  if (format.tag) {
    if (format.type === 'line') {
      node = dom(node).switchTag(format.tag).get();
    } else {
      if (dom.VOID_TAGS[format.tag]) {
        node = dom(node).replace(this.document.createElement(format.tag)).get();
      } else {
        dom(node).wrap(this.document.createElement(format.tag));
        node = node.parentNode;
      }
    }
  }

  if (format.parentTag) {
    var parent = this.document.createElement(format.parentTag);
    dom(node).wrap(parent);
    if (parent.previousSibling && parent.tagName === parent.previousSibling.tagName) {
      dom(parent.previousSibling).merge(parent);
    }
    if (parent.nextSibling && parent.tagName === parent.nextSibling.tagName) {
      dom(parent).merge(parent.nextSibling);
    }
  }

  if (format.attribute || format.class || format.style) {
    if (dom(node).isTextNode()) {
      var wrapper = this.document.createElement(this.inlineTag);
      node = dom(node).wrap(wrapper);
      node = wrapper;
    }
    if (format.attribute) {
      node.setAttribute(format.attribute, value);
    }
    if (format.class) {
      if (typeof node.classList === 'undefined') {
        var newClass = format.class + value;
        var className = node.className;
        node.className = className.length ? (className + ' ' + newClass) : (className + newClass);
      } else {
        node.classList.add(format.class + value);
      }
    }
    if (format.style && value !== format.default) {
      node.style[format.style] = value;
    }
  }

  if (typeof format.add === 'function') {
    node = format.add(node, value, dom);
  }

  return node;
};

Doc.prototype.formatLine = function(attrs) {
  var line = this.line;

  // TODO: each format function returns a promise
  var self = this;
  intersection(this.formatOrder, Object.keys(attrs)).forEach(function(name) {
    var format = self.formats[name];
    if (format && format.type === 'line') {
      line = self.applyFormat(line, format, attrs[name]);
    }
  });

  this.line = line;
};
