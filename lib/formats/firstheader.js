var firstheader = { type: 'line', tag: 'H1' };

exports.public = firstheader;
exports.private = Object.assign({}, firstheader, { exclusive: true });
