var JSDOM = require('jsdom').JSDOM;
var convert = require('./lib/convert');

module.exports = function(delta, formats, options) {
  options.document = new JSDOM().window.document;
  return convert(delta, formats, options);
};

