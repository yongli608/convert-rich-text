var pick = require('lodash').pick;
var toHtml = require('./to_html');
var internalFormats = require('../formats').internal;
var formatOptions = require('../formats').options;

module.exports = function toInternalHtml(delta, formats, options) {
  formats = formats ? pick(internalFormats, formats) : internalFormats;
  return toHtml(delta, formats, Object.assign({}, formatOptions, options));
};
