var uuid = require('uuid');

var USE_FIXED_HEIGHT = [
  'gallery',
  'html',
  'image',
  'imageslider',
  'ratingcard',
  'video',
  'hr',
  'toh_project_details',
  'toh_tools',
  'pym_js'
];

module.exports = function(type) {
  return {
    type: 'embed',
    tag: 'IFRAME',
    add: function(node, value) {
      var object = {};
      object[type] = value;
      node.setAttribute('data-object', JSON.stringify(object));
      node.setAttribute('data-frame-id', uuid.v4());
      node.setAttribute('allowfullscreen', '');

      var objectType = type === 'doc' ? value.type : type;
      node.classList.add(objectType + '-object');
      if (USE_FIXED_HEIGHT.includes(objectType)) {
        node.setAttribute('data-preserve-height', true);
      }

      var depth = numParents();
      var src = depth ? '/object.html?parents=' + depth : '/object.html';
      node.setAttribute('src', src);

      return node;
    },
    remove: function(node) {
      node.removeAttribute('data-object');
      node.removeAttribute('data-frame-id');
      node.removeAttribute('allowfullscreen');
      node.removeAttribute('data-preserve-height');
      node.removeAttribute('src');
      node.className = '';

      return node;
    },
    value: function(node) {
      return JSON.parse(node.dataset.object)[type];
    },
    match: function(node) {
      return node.tagName === 'IFRAME' && 'object' in node.dataset && type in JSON.parse(node.dataset.object);
    }
  };
};

function numParents() {
  /* jshint ignore:start */
  var num = 0;
  var win = window;
  while (window && win !== window.top) {
    num += 1;
    win = win.parent;
  }

  return num;
  /* jshint ignore:end */
}
