var jsdom = require('jsdom').JSDOM;
var convert = require('./lib/convert');

module.exports = function(delta, formats, options) {
  options.document = new jsdom().window.document;
  return convert(delta, formats, options);
};

