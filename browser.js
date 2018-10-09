var toHtml = require('./lib/export/to_html');

module.exports = function(delta, formats, options) {
  options.document = document;
  return toHtml(delta, formats, options);
};
