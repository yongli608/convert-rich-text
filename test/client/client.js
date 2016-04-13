var assert = require('chai').assert;
var convert = require('../../browser');

var data = require('../data');
var formats = data.formats;
var tests = data.tests;

function runTest(test) {
  it(test.desc, function(done) {
    if (!test.hasOwnProperty('opts')) {
      test.opts = {};
    }
    var result = convert(test.delta, formats, test.opts);
    if (typeof test.expected === 'object') {
      assert.equal(result, test.expected.client);
    } else {
      assert.equal(result, test.expected);
    }
    done();
  });
}

describe('client-side', function() {
  tests.forEach(runTest);

  it('throws an error for a delta with non-inserts', function() {
    assert.throws(function() {
      convert({ ops: [{ insert: 'abc' }, { retain: 3 }] }, formats, {});
    }, 'Cannot convert delta with non-insert operations');
  });
});
