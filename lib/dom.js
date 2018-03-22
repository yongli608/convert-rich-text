var dom = module.exports = function(node) {
  if (!(this instanceof dom)) {
    return new dom(node); // jshint ignore:line
  }

  this.node = node;
};

dom.ELEMENT_NODE = 1;
dom.TEXT_NODE = 3;
dom.DEFAULT_BREAK_TAG = 'BR';
dom.EMBED_TEXT = '!';
dom.VOID_TAGS = {
  AREA: true,
  BASE: true,
  BR: true,
  COL: true,
  COMMAND: true,
  EMBED: true,
  HR: true,
  IFRAME: true,
  IMG: true,
  INPUT: true,
  KEYGEN: true,
  LINK: true,
  META: true,
  PARAM: true,
  SOURCE: true,
  TRACK: true,
  WBR: true
};
dom.EMBED_TAGS = {
  IFRAME: true,
  IMG: true
};
dom.BLOCK_TAGS = {
  ADDRESS: true,
  ARTICLE: true,
  ASIDE: true,
  AUDIO: true,
  BLOCKQUOTE: true,
  CANVAS: true,
  DD: true,
  DIV: true,
  DL: true,
  FIGCAPTION: true,
  FIGURE: true,
  FOOTER: true,
  FORM: true,
  H1: true,
  H2: true,
  H3: true,
  H4: true,
  H5: true,
  H6: true,
  HEADER: true,
  HGROUP: true,
  LI: true,
  OL: true,
  OUTPUT: true,
  P: true,
  PRE: true,
  SECTION: true,
  TABLE: true,
  TBODY: true,
  TD: true,
  TFOOT: true,
  TH: true,
  THEAD: true,
  TR: true,
  UL: true,
  VIDEO: true
};

dom.prototype.attributes = function(attributes) {
  if (attributes) {
    var self = this;
    Object.keys(attributes).forEach(function(name) {
      self.node.setAttribute(name, attributes[name]);
    });
    return this;
  } else {
    attributes = {};
    for (var i = 0; i < this.node.attributes.length; i++) {
      var attr = this.node.attributes[i];
      attributes[attr.name] = attr.value;
    }
    return attributes;
  }
};

dom.prototype.get = function() {
  return this.node;
};

dom.prototype.isElement = function() {
  return this.node.nodeType === dom.ELEMENT_NODE;
};

dom.prototype.isTextNode = function() {
  return this.node.nodeType === dom.TEXT_NODE;
};

dom.prototype.merge = function(node) {
  var $node = dom(node);
  if (this.isElement()) {
    $node.moveChildren(this.node);
    this.normalize();
  } else {
    this.text(this.text() + $node.text());
  }
  $node.remove();
  return this;
};

dom.prototype.moveChildren = function(newNode) {
  while (this.node.firstChild) {
    newNode.appendChild(this.node.firstChild);
  }
  return this;
};

dom.prototype.normalize = function() {
  var node = this.node.firstChild;
  var nextNode;
  var $node;
  while (node) {
    nextNode = node.nextSibling;
    $node = dom(node);
    if (nextNode && dom(nextNode).isTextNode()) {
      if ($node.text().length === 0) {
        $node.remove();
      } else if ($node.isTextNode()) {
        var followingNode = nextNode.nextSibling;
        $node.merge(nextNode);
        nextNode = followingNode;
      }
    }
    node = nextNode;
  }
  return this;
};

dom.prototype.remove = function() {
  if (this.node.parentNode) {
    this.node.parentNode.removeChild(this.node);
  }
  this.node = null;
  return null;
};

dom.prototype.replace = function(newNode) {
  this.node.parentNode.replaceChild(newNode, this.node);
  this.node = newNode;
  return this;
};

dom.prototype.switchTag = function(newTag) {
  newTag = newTag.toUpperCase();
  if (this.node.tagName === newTag) { return this; }
  var newNode = this.node.ownerDocument.createElement(newTag);
  var attributes = this.attributes();
  if (!dom.VOID_TAGS[newTag]) { this.moveChildren(newNode); }
  this.replace(newNode);
  this.attributes(attributes);
  return this;
};

dom.prototype.text = function(text) {
  if (text) {
    switch (this.node.nodeType) {
    case dom.ELEMENT_NODE:
      this.node.textContent = text;
      break;
    case dom.TEXT_NODE:
      this.node.data = text;
      break;
    }
    return this;
  } else {
    switch (this.node.nodeType) {
    case dom.ELEMENT_NODE:
      if (this.node.tagName === dom.DEFAULT_BREAK_TAG) {
        return '';
      }
      if (dom.EMBED_TAGS[this.node.tagName]) {
        return dom.EMBED_TEXT;
      }
      if (this.node.textContent) {
        return this.node.textContent;
      }
      return '';
    case dom.TEXT_NODE:
      return this.node.data || '';
    default:
      return '';
    }
  }
};

dom.prototype.wrap = function(wrapper) {
  if (this.node.parentNode) {
    this.node.parentNode.insertBefore(wrapper, this.node);
  }
  var parent = wrapper;
  while (parent.firstChild) {
    parent = parent.firstChild;
  }
  parent.appendChild(this.node);
  return this;
};
