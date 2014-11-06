var merge = require('merge-recursive');

//
// This is where we store the various converters for output
//
var converters = {};

//
// Convert the delta into the given format
//
// @param {delta} the delta to convert
// @param {format} the name of a format to convert to
// @param {options} formatting options
// @return string
//
exports = module.exports = function(delta, format, options) {
  var ops = delta.ops ? delta.ops : delta;
  var allInserts = ops.every(function(op) {
    return op.insert;
  });

  if (!allInserts) {
    throw new Error('Cannot convert delta with non-insert operations');
  }

  if (!converters[format]) {
    exports.loadConverter(format);
  }

  format = converters[format];

  options = merge.recursive({}, format.defaults || {}, options || {});

  return format.convert(delta, options);
};

//
// Define a new output format
//
// @param {type} optional, the type of processing function ("line", "op", or "raw")
// @param {name} the name of the format
// @param {defaults} defaults options
// @param {convert} the processing function
// @return void
//
exports.defineConverter = function defineConverter(type, name, defaults, convert) {
  converters[name] = {
    type: type,
    convert: convert,
    defaults: defaults
  };
};

//
// Load a built-in format
//
// @param {name} the name of the format to load
// @return void
//
exports.loadConverter = function loadConverter(name) {
  try {
    converters[name] = require('./converters/' + name);
  } catch (err) {
    throw new Error('Unknown conversion format "' + name + '"');
  }
};

//
// Convert a delta to an array of deltas, one per line
//
// @param {delta} the document delta
// @return array
//
exports.toLines = function toLines(ops) {
  var lines = [];
  var line;

  function newline() {
    line = { ops: [], attributes: {} };
    lines.push(line);
  }

  newline();

  for (var i = 0, op; (op = ops[i]); i++) {
    // This is an EOL marker
    if (op.insert === '\n') {
      line.attributes = op.attributes;
      newline();
    }

    // If this op is an embed, it belongs on its own line
    else if (typeof op.insert === 'number') {
      // Create a new line for this if we're currently in the middle of line
      if (line.ops.length) {
        newline();
      }
      line.ops.push(op);
      if (i < ops.length - 1) newline();
    }

    // If this op contains a newline, we will need to break it up
    else if (op.insert.indexOf('\n') >= 0) {
      var chunks = op.insert.split('\n');
      for (var j = 0, chunk; (chunk = chunks[j]); j++) {
        line.ops.push({ insert: chunk, attributes: op.attributes });
        if (j < chunks.length - 1) newline();
      }
    }

    // Otherwise, this is just an inline chunk
    else {
      line.ops.push(op);
    }
  }

  return lines;
};
