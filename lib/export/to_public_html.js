var pick = require('lodash').pick;
var toHtml = require('./to_html');
var publicFormats = require('../formats').public;
var formatOptions = require('../formats').options;

module.exports = function toPublicHtml(delta, formats, options) {
  formats = formats ? pick(publicFormats, formats) : publicFormats;
  return toHtml(delta, formats, Object.assign({}, formatOptions, options));
};
