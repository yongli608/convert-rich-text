var blockquote = { type: 'line', parentTag: 'BLOCKQUOTE' };

exports.public = blockquote;
exports.private = Object.assign({}, blockquote, { exclusive: true, inherit: true });
