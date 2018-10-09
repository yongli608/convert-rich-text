var italic = { tag: 'EM' };

exports.public = italic;
exports.private = Object.assign({}, italic, { prepare: 'italic' });
