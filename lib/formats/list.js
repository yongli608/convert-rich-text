var list = { type: 'line', parentTag: 'OL', tag: 'LI' };

exports.public = list;
exports.private = Object.assign({}, list, { exclusive: true, inherit: true });
