var convert = require('./lib/convert');

module.exports = function(delta, formats, options) {
  options.document = document;
  return convert(delta, formats, options);
};
