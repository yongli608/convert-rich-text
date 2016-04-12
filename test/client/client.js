var assert = require('chai').assert;
var convert = require('../../browser');

var data = require('../data');
var formats = data.formats;
var tests = data.tests;

describe('client-side', function() {
  tests.forEach(function(test) {
    it(test.desc, function(done) {
      if (!test.hasOwnProperty('opts')) {
        test.opts = {};
      }
      var result = convert(test.delta, formats, test.opts);
      assert.equal(result, test.expected);
      done();
    });
  });

  it('throws an error for a delta with non-inserts', function() {
    assert.throws(function() {
      convert({ ops: [{ insert: 'abc' }, { retain: 3 }] }, formats);
    }, 'Cannot convert delta with non-insert operations');
  });
});
