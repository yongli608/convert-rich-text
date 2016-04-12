var jsdom = require('jsdom').jsdom;
var convert = require('./lib/convert');

module.exports = function(delta, formats, options) {
  options.document = jsdom();
  return convert(delta, formats, options);
};

