/**
 * @param {object} delta - A rich-text delta.
 * @param {function|string} [mapper=' '] - A string to replace objects with, or a function to map from object value to a string.
 * @return {string} - The plain-text representation of the input.
 */
module.exports = function toPlaintext(delta, mapper) {
  if (!delta) {
    return;
  }
  mapper = mapper || ' ';
  return delta.ops.reduce(function(text, op) {
    var chunk;
    if (typeof op.insert === 'string') {
      chunk = op.insert;
    } else {
      chunk = (typeof mapper === 'function') ? mapper(op.insert) : mapper;
    }
    return text + chunk;
  }, '').replace(/\n$/, '');
};
