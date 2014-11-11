var assert = require('assert');
var convert = require('./index');
var tests = [
  {
    desc: 'Complex HTML',
    format: 'html',
    delta: [
      {insert: 'Hello, World!\nThis is a second line.', attributes: {bold: true}},
      {insert: '\n', attributes: {firstheader: true}},
      {insert: 'This is a demo of convert-rich-text'},
      {insert: 1, attributes: {
        image: 'monkey.png'
      }},
      {insert: 'Google', attributes: {link: 'https://www.google.com'}}
    ],
    expected:
      '<p><b>Hello, World!</b></p>\n' +
      '<h1><b>This is a second line.</b></h1>\n' +
      '<p>This is a demo of convert-rich-text</p>\n' +
      '<p><img src="monkey.png"/></p>\n' +
      '<p><a href="https://www.google.com">Google</a></p>'
  },
  {
    desc: 'Lists',
    format: 'html',
    delta: [
      {insert: 'Consecutive list elements'},
      {insert: '\n', attributes: {list: true}},
      {insert: 'Should create a parent tag'},
      {insert: '\n', attributes: {list: true}},
      {insert: 'Consecutive bullet elements'},
      {insert: '\n', attributes: {bullet: true}},
      {insert: 'Should create a parent tag'},
      {insert: '\n', attributes: {bullet: true}}
    ],
    expected:
      '<ol><li>Consecutive list elements</li>\n' +
      '<li>Should create a parent tag</li></ol>\n' +
      '<ul><li>Consecutive bullet elements</li>\n' +
      '<li>Should create a parent tag</li></ul>'
  }
];

tests.forEach(function(test) {
  it(test.desc, function() {
    var result = convert(test.delta, test.format);
    // console.log(result);
    // console.log(test.expected);
    assert.equal(result, test.expected);
  });
});

it('throws an error for a delta with non-inserts', function() {
  var msg;

  try {
    convert([ { insert: 'abc' }, { retain: 3 }], 'html');
  } catch (err) {
    msg = err.message;
  }

  assert.equal(msg, 'Cannot convert delta with non-insert operations');
});

it('throws an error for unknown format', function() {
  var msg;

  try {
    convert([ { insert: 'abc' } ], 'bogus');
  } catch (err) {
    msg = err.message;
  }

  assert.equal(msg, 'Unknown conversion format "bogus"');
});
