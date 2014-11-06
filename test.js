var assert = require('assert');
var convert = require('./index');
var tests = [
  {
    desc: 'HTML',
    format: 'html',
    delta: [
      {insert: 'Hello, World!\nThis is a second line.', attributes: {bold: true}},
      {insert: '\n', attributes: {firstheader: true}},
      {insert: 'This is a demo of the Quilljs Renderer'},
      {insert: 1, attributes: {
        image: 'monkey.png',
        alt: 'Funny monkey picture'
      }},
      {insert: 'Google', attributes: {link: 'https://www.google.com'}}
    ],
    expected:
      '<p><b>Hello, World!</b></p>\n' +
      '<h1><b>This is a second line.</b></h1>\n' +
      '<p>This is a demo of the Quilljs Renderer</p>\n' +
      '<p><img src="monkey.png" alt="Funny monkey picture" /></p>\n' +
      '<p><a href="https://www.google.com">Google</a></p>'
  }
];

tests.forEach(function(test) {
  it(test.desc, function() {
    assert.equal(convert(test.delta, test.format), test.expected);
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
