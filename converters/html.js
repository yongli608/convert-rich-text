var merge = require('merge-recursive');
var HTML = require('html-generate');
var toLines = require('../index').toLines;

var embeds = {
  1: 'image'
};

exports.defaults = {
  embed: {
    image: {
      tag: 'img',
      attribute: 'src'
    }
  },
  block: {
    default: {
      tag: 'p'
    },
    firstheader: {
      tag: 'h1'
    },
    secondheader: {
      tag: 'h2'
    },
    thirdheader: {
      tag: 'h3'
    },
    bullet: {
      parentTag: 'ul',
      tag: 'li'
    },
    list: {
      parentTag: 'ol',
      tag: 'li'
    }
  },
  inline: {
    default: {
    },
    link: {
      tag: 'a',
      attribute: 'href'
    },
    bold: {
      tag: 'b'
    },
    italic: {
      tag: 'i'
    },
    underline: {
      tag: 'u'
    },
    strikethrough: {
      tag: 's'
    }
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
  var currentParentTag = null;

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
      var key = embeds[op.insert];
      return convertFormat(null, op.attributes, key, options.embed[key]);
    } else {
      return convertAll(op.insert, op.attributes, options.inline);
    }
  }

  function convertAll(content, attrs, formats) {
    var count = 0;
    attrs = attrs || {};
    content = Object.keys(attrs).reduce(function(memo, key) {
      var format = formats[key];
      if (format) {
        count += 1;
        memo = convertFormat(memo, attrs, key, format);
      }
      return memo;
    }, content);
    // If none of the formats match the attrs, ensure the default format runs
    if (count === 0) {
      content = convertFormat(content, attrs, 'default', formats.default);
    }
    return content;
  }

  function convertFormat(content, attrs, name, format) {
    if (format.parentTag) {
      currentParentTag = format.parentTag;
    }

    if (format.tag) {
      if (format.attribute) {
        var a = {};
        a[format.attribute] = attrs[name];
        return HTML.element({ tagName: format.tag, html: content, attributes: a });
      } else {
        return HTML.element({ tagName: format.tag, html: content });
      }
    } else {
      return content;
    }
  }
};
