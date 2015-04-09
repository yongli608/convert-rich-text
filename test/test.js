var assert = require('chai').assert;
var convert = require('convert-rich-text');
var formats = {
  bold: { tag: 'B' },
  firstheader: { type: 'line', tag: 'H1' },
  image: { type: 'embed', tag: 'IMG', attr: 'src' },
  link: { tag: 'A', attr: 'href' },
  bullet: { type: 'line', tag: 'LI', parentTag: 'UL' },
  list: { type: 'line', tag: 'LI', parentTag: 'OL' },
  reverse: function(node) {
    var newNode = document.createTextNode(node.textContent.split('').reverse().join(''));
    node.parentNode.replaceChild(newNode, node);
    return newNode;
  },
  repeat: function(node, value) {
    var frag = document.createDocumentFragment();
    for (var i = 0, n = parseInt(value); i < n; i++) {
      frag.appendChild(node.cloneNode(true));
    }
    node.parentNode.replaceChild(frag, node);
    return frag;
  }
};
var tests = [
  {
    desc: 'Simple inline tags',
    delta: { ops: [
      {insert: 'Hello, World!\n', attributes: {bold: true}}
    ]},
    expected:
      '<p><b>Hello, World!</b></p>'
  },
  {
    desc: 'Line formats, embeds, and attributes',
    delta: { ops: [
      {insert: 'Hello, World!\nThis is a second line.', attributes: {bold: true}},
      {insert: '\n', attributes: {firstheader: true}},
      {insert: 'This is a demo of convert-rich-text'},
      {insert: 1, attributes: {
        image: 'http://i.imgur.com/2ockv.gif'
      }},
      {insert: 'Google', attributes: {link: 'https://www.google.com'}}
    ]},
    expected:
      '<p><b>Hello, World!</b></p>' +
      '<h1><b>This is a second line.</b></h1>' +
      '<p>This is a demo of convert-rich-text</p>' +
      '<p><img src="http://i.imgur.com/2ockv.gif"></p>' +
      '<p><a href="https://www.google.com">Google</a></p>'
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
    desc: 'Custom',
    delta: { ops: [
      {insert: 'Hello World!', attributes: {reverse: true}},
      {insert: '\n'},
      {insert: 'Foo Bar Baz', attributes: {bold: true, repeat: 3}},
      {insert: '\n'}
    ]},
    expected:
      '<p>!dlroW olleH</p>' +
      '<p><b>Foo Bar Baz</b><b>Foo Bar Baz</b><b>Foo Bar Baz</b></p>'
  }
];

tests.forEach(function(test) {
  it(test.desc, function() {
    var result = convert(test.delta, formats);
    assert.equal(result, test.expected);
  });
});

it('throws an error for a delta with non-inserts', function() {
  assert.throws(function() {
    convert({ ops: [{ insert: 'abc' }, { retain: 3 }] }, formats);
  }, 'Cannot convert delta with non-insert operations');
});
