var convert = require('../../index');
var assert = require('chai').assert;

describe('to_plaintext', function() {
  it('removes objects and the last newline', function() {
    var delta = { ops: [
      { insert: 'Hello\n' },
      { insert: { hr: true } },
      { insert: 'World' },
      { insert: { html: { value: '<strong>Goodbye!</strong>' } } },
      { insert: '\n' }
    ] };
    assert.equal(convert.toPlaintext(delta), 'Hello\n World ');
  });

  it('can handle multiple inserts', function() {
    var delta = { ops: [
      { insert: 'Tacos ' },
      { insert: 'are' },
      { insert: ' great!' },
      { insert: '\n' }
    ] };
    assert.equal(convert.toPlaintext(delta), 'Tacos are great!');
  });

  it('handle objects by replacing with a custom string', function() {
    var delta = { ops: [
      { insert: 'Hello World!\n' },
      { insert: { bogus: true } },
      { insert: 'Goodbye!\n' }
    ] };
    var actual = convert.toPlaintext(delta, 'bogus\n');
    assert.equal(actual, 'Hello World!\nbogus\nGoodbye!');
  });

  it('handle html objects by passing a mapper function', function() {
    var delta = { ops: [
      { insert: 'Hello World!\n' },
      { insert: { html: { value: '<strong>Goodbye!</strong>' } } },
      { insert: '\n' }
    ] };
    var actual = convert.toPlaintext(delta, function(object) {
      return object.html.value.replace(/<[^>]+>/g, '');
    });
    assert.equal(actual, 'Hello World!\nGoodbye!');
  });
});
