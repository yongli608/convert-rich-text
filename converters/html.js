var merge = require('merge-recursive');
var format = require('stringformat');
var toLines = require('../index').toLines;

exports.defaults = {
  embed: {
    1: '<img src="{image}" alt="{alt}" />'
  },
  block: {
    default: '<p>{content}</p>',
    firstheader: '<h1>{content}</h1>',
    secondheader: '<h2>{content}</h2>',
    thirdheader: '<h3>{content}</h3>',
    bullet: '<ul><li>{content}</li></ul>',
    list: '<ol><li>{content}</li></ol>'
  },
  inline: {
    default: '{content}',
    link: '<a href="{link}">{content}</a>',
    bold: '<b>{content}</b>',
    italic: '<i>{content}</i>',
    underline: '<u>{content}</u>',
    strikethrough: '<s>{content}</s>'
  }
};

//
// Process a single line into HTML
//
// @param {line} the line object, containing ops and attributes
// @param {options} the options given
// @param {index} the line index (zero-based)
// @return string
//
exports.convert = function(delta, options) {
  return toLines(delta).map(function(line, index) {
    var content = line.ops.map(convertOp).join('');
    var attrs = merge({}, line.attributes, { lineNumber: index + 1 });

    return convertAll(content, attrs, options.block);
  }).join('\n');

  //
  // Render a section of text using style HTML tags like <b> and <i>
  //
  function convertOp(op) {
    if (typeof op.insert === 'number') {
      return convertTemplate(op.insert, op.attributes, options.embed[op.insert]);
    } else {
      return convertAll(op.insert, op.attributes, options.inline);
    }
  }

  function convertAll(content, attrs, formats) {
    var count = 0;
    attrs = attrs || {};
    content = Object.keys(attrs).reduce(function(memo, key) {
      var template = formats[key];
      if (template) {
        count += 1;
        memo = convertTemplate(memo, attrs, template);
      }
      return memo;
    }, content);
    // If none of the formats match the attrs, ensure the default format runs
    if (count === 0) {
      content = convertTemplate(content, attrs, formats.default);
    }
    return content;
  }

  function convertTemplate(content, attrs, template) {
    var attributes = merge({}, attrs, { content: content });

    if (typeof template === 'function') {
      template = template(attributes, options);
    }

    return format(template, attributes);
  }
};
