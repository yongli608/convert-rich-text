exports.formats = {
  bold: { tag: 'B' },
  color: { style: 'color' },
  user: { class: 'user-' },
  firstheader: { type: 'line', tag: 'H1' },
  image: { type: 'embed', tag: 'IMG', attribute: 'src' },
  link: { tag: 'A', attribute: 'href' },
  className: { attribute: 'class' },
  bullet: { type: 'line', tag: 'LI', parentTag: 'UL' },
  list: { type: 'line', tag: 'LI', parentTag: 'OL' },
  reverse: {
    add: function(node) {
      var newNode = node.ownerDocument.createTextNode(node.textContent.split('').reverse().join(''));
      node.parentNode.replaceChild(newNode, node);
      return newNode;
    }
  },
  repeat: {
    add: function(node, value) {
      var frag = node.ownerDocument.createDocumentFragment();
      for (var i = 0, n = parseInt(value); i < n; i++) {
        frag.appendChild(node.cloneNode(true));
      }
      node.parentNode.replaceChild(frag, node);
      return frag;
    }
  },
  parent: {
    add: function(node, value, dom) {
      dom(node.parentNode).switchTag(value);
      return node;
    }
  },
  data: {
    type: 'line',
    add: function(node, value) {
      Object.keys(value).forEach(function(key) {
        node.setAttribute('data-' + key, value[key]);
      });
      return node;
    }
  }
};

exports.tests = [
  {
    desc: 'No formats',
    delta: { ops: [
      {insert: 'Hello world\n'}
    ]},
    expected:
      '<div>Hello world</div>'
  },
  {
    desc: 'Simple inline tags',
    delta: { ops: [
      {insert: 'Hello, '},
      {insert: 'World!', attributes: {bold: true}},
      {insert: '\n'}
    ]},
    expected:
      '<div>Hello, <b>World!</b></div>'
  },
  {
    desc: 'Line formats, embeds, and attributes',
    delta: { ops: [
      {insert: 'Hello, World!\nThis is a second line.', attributes: {bold: true}},
      {insert: '\n', attributes: {firstheader: true}},
      {insert: 'This is a demo of convert-rich-text '},
      {insert: 1, attributes: {
        image: 'http://i.imgur.com/2ockv.gif'
      }},
      {insert: ' '},
      {insert: 'Google', attributes: {link: 'https://www.google.com'}},
      {insert: '\n'}
    ]},
    expected:
      '<div><b>Hello, World!</b></div>' +
      '<h1><b>This is a second line.</b></h1>' +
      '<div>This is a demo of convert-rich-text ' +
      '<img src="http://i.imgur.com/2ockv.gif"> ' +
      '<a href="https://www.google.com">Google</a></div>'
  },
  {
    desc: 'classes and styles',
    delta: { ops: [
      {insert: 'Hello world', attributes: { color: 'red', user: 1234 }},
      {insert: '\n'}
    ]},
    expected: {
      client: '<div><span class="user-1234" style="color: red;">Hello world</span></div>',
      server: '<div><span style="color: red;" class="user-1234">Hello world</span></div>'
    }
  },
  {
    desc: 'attribute with implicit span tag',
    delta: { ops: [
      {insert: 'hello world', attributes: { className: 'greeting' }},
      {insert: '\n'}
    ]},
    expected:
      '<div><span class="greeting">hello world</span></div>'
  },
  {
    desc: 'Lists',
    delta: { ops: [
      {insert: 'Consecutive list elements'},
      {insert: '\n', attributes: {list: true}},
      {insert: 'Should create a parent tag'},
      {insert: '\n', attributes: {list: true}},
      {insert: 'Consecutive bullet elements'},
      {insert: '\n', attributes: {bullet: true}},
      {insert: 'Should create a parent tag'},
      {insert: '\n', attributes: {bullet: true}}
    ]},
    expected:
      '<ol><li>Consecutive list elements</li>' +
      '<li>Should create a parent tag</li></ol>' +
      '<ul><li>Consecutive bullet elements</li>' +
      '<li>Should create a parent tag</li></ul>'
  },
  {
    desc: 'Links',
    delta: { ops: [
      {attributes:{bold:true},insert:'hello'},
      {insert:' '},
      {attributes:{link:'http://vox.com'},insert:'world'},
      {insert:' this works...?\n'}
    ]},
    expected:
      '<div><b>hello</b> <a href="http://vox.com">world</a> this works...?</div>'
  },
  {
    desc: 'Link inside list',
    delta: { ops: [
      {insert: 'Some text '},
      {insert: 'a link', attributes: {link: 'http://vox.com'}},
      {insert: ' more text'},
      {insert: '\n', attributes: {list: true}}
    ]},
    expected:
      '<ol><li>Some text <a href="http://vox.com">a link</a> more text</li></ol>'
  },
  {
    desc: 'Modify parent',
    delta: { ops: [
      {insert: 'hello world', attributes: { parent: 'article' } },
      {insert: '\n', attributes: { firstheader: true } }
    ]},
    expected:
      '<h1>hello world</h1>'
  },
  {
    desc: 'Custom formats',
    delta: { ops: [
      {insert: 'Hello World!', attributes: {reverse: true}},
      {insert: '\n'},
      {insert: 'Foo Bar Baz', attributes: {bold: true, repeat: 3}},
      {insert: '\n', attributes: { data: {foo: 'bar'}}}
    ]},
    expected:
      '<div>!dlroW olleH</div>' +
      '<div data-foo="bar"><b>Foo Bar Baz</b><b>Foo Bar Baz</b><b>Foo Bar Baz</b></div>'
  },
  {
    desc: 'Change default blockTag',
    delta: { ops: [{insert: 'Hello world'}]},
    opts: { blockTag: 'P' },
    expected: '<p>Hello world</p>'
  },
  {
    desc: 'Line formats with no contents',
    delta: { ops: [{insert: '\n', attributes: {firstheader: true} }] },
    expected: '<h1></h1>'
  }
];
