var toPublicHtml = require('./to_public_html');

module.exports = function(delta, formats, options) {
  return toPublicHtml(delta, formats, Object.assign({}, options, { blockTag: 'DIV' }))
    .replace(/^<div>|<\/div>$/g, '')
    .replace('<div></div>', '<br>')
    .replace('</div><div>', '<br>');
};
