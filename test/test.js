var assert = require('chai').assert;
var browserConvert = require('../browser');
var serverConvert = require('../index');

var data = require('./data');
var formats = data.formats;
var tests = data.tests;

describe('client-side', function() {
  tests.forEach(function(test) {
    it(test.desc, function() {
      var result = browserConvert(test.delta, formats, test.opts);
      assert.equal(result, test.expected);
    });
  });

  it('throws an error for a delta with non-inserts', function() {
    assert.throws(function() {
      browserConvert({ ops: [{ insert: 'abc' }, { retain: 3 }] }, formats);
    }, 'Cannot convert delta with non-insert operations');
  });
});

describe('server-side', function() {
  tests.forEach(function(test) {
    it(test.desc, function() {
      var result = serverConvert(test.delta, formats, test.opts);
      assert.equal(result, test.expected);
    });
  });

  it('throws an error for a delta with non-inserts', function() {
    assert.throws(function() {
      serverConvert({ ops: [{ insert: 'abc' }, { retain: 3 }] }, formats);
    }, 'Cannot convert delta with non-insert operations');
  });
});
