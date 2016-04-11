var jsdom = require('jsdom').jsdom;

module.exports = function() {
  if (typeof document === 'undefined') {
    return jsdom();
  } else {
    return document;
  }
}
