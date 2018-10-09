var thirdheader = { type: 'line', tag: 'H3' };

exports.public = thirdheader;
exports.private = Object.assign({}, thirdheader, { exclusive: true });
