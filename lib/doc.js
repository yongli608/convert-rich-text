var dom = require('./dom');

module.exports = Doc;

function Doc(formats, options) {
  this.formats = formats;
  this.options = options;
  this.root = document.createElement('div');
  this.line = null;
}

Doc.prototype.write = function(op) {
  if (op.insert === null || op.insert === undefined) {
    throw new Error('Cannot convert delta with non-insert operations');
  }

  var attrs = op.attributes || {};
  var text = (typeof op.insert === 'string') ?
    op.insert.replace(/\r\n?/g, '\n') : '!';
  var lineTexts = text.split('\n');

  // TODO: each loop iteration may be async
  lineTexts.forEach(function(lineText, i) {
    if (lineText.length) {
      this.newLine();
      this.appendChild(lineText, attrs);
    }

    if (i < lineTexts.length - 1) {
      this.formatLine(attrs);
    }
  }.bind(this));

  return this;
};

Doc.prototype.getHTML = function() {
  return this.root.innerHTML;
};

Doc.prototype.newLine = function() {
  var node = document.createElement('p');
  this.root.appendChild(node);
  this.line = node;
};

Doc.prototype.appendChild = function(text, attrs) {
  var node = document.createTextNode(text);

  this.line.appendChild(node);

  // TODO: loop through in priority order
  // TODO: each format function returns a promise
  Object.keys(attrs).forEach(function(name) {
    var format = this.formats[name];
    if (format && format.type !== 'line') {
      node = this.applyFormat(node, format, attrs[name]);
    }
  }.bind(this));

  // TODO: optimize line?
};

Doc.prototype.applyFormat = function(node, format, value) {
  if (typeof format === 'function') {
    return format(node, value);
  }

  if (format.parentTag) {
    var parentNode = document.createElement(format.parentTag);
    dom(node).wrap(parentNode);
    if (node.parentNode.previousSibling && node.parentNode.tagName === node.parentNode.previousSibling.tagName) {
      dom(node.parentNode.previousSibling).merge(node.parentNode);
    }
    if (node.parentNode.nextSibling && node.parentNode.tagName === node.parentNode.nextSibling.tagName) {
      dom(node.parentNode).merge(node.parentNode.nextSibling);
    }
  }

  if (format.tag) {
    if (format.type === 'line') {
      node = dom(node).switchTag(format.tag).get();
    } else {
      var newNode = document.createElement(format.tag);
      if (dom.VOID_TAGS[format.tag]) {
        if (node.parentNode) {
          dom(node).replaceWith(newNode);
        }
      } else {
        dom(node).wrap(newNode);
      }
      node = newNode;
    }
  }

  if (format.attr) {
    node.setAttribute(format.attr, value);
  }

  return node;
};

Doc.prototype.formatLine = function(attrs) {
  var line = this.line;

  // TODO: loop through in priority order
  // TODO: each format function returns a promise
  Object.keys(attrs).forEach(function(name) {
    var format = this.formats[name];
    if (format && format.type === 'line') {
      line = this.applyFormat(line, format, attrs[name]);
    }
  }.bind(this));

  this.line = line;
  return line;
};
