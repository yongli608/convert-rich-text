var convert = require('../../index');
var assert = require('chai').assert;

describe('to_inline_html', function() {
  it('converts all tags appropriately', function() {
    var delta = { ops: [
      { insert: 'This', attributes: { strike: true } },
      { insert: ' is ' },
      { insert: 'my', attributes: { italic: true } },
      { insert: ' ' },
      { insert: 'test', attributes: { bold: true } },
      { insert: ' ' },
      { insert: 'see?', attributes: { link: 'http://voxmedia.com/' } },
      { insert: '\n' }
    ] };
    assert.equal(convert.toInlineHtml(delta), '<s>This</s> is <em>my</em> <strong>test</strong> <a href="http://voxmedia.com/">see?</a>');
  });

  it('replaces any extra newlines with <br> tags', function() {
    var delta = { ops: [
      { insert: 'This is\nmy test' },
      { insert: '\n' }
    ]};
    assert.equal(convert.toInlineHtml(delta), 'This is<br>my test');
  });
});
