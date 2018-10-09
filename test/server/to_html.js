var assert = require('chai').assert;
var convert = require('../../index');

var data = require('../data');
var formats = data.formats;
var tests = data.tests;

describe('server-side', function() {
  tests.forEach(function(test) {
    it(test.desc, function(done) {
      if (!test.hasOwnProperty('opts')) {
        test.opts = {};
      }
      var result = convert.toHtml(test.delta, formats, test.opts);
      if (typeof test.expected === 'object') {
        assert.equal(result, test.expected.server);
      } else {
        assert.equal(result, test.expected);
      }
      done();
    });
  });

  it('throws an error for a delta with non-inserts', function() {
    assert.throws(function() {
      convert.toHtml({ ops: [{ insert: 'abc' }, { retain: 3 }] }, formats, {});
    }, 'Cannot convert delta with non-insert operations');
  });
});
