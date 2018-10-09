var secondheader = { type: 'line', tag: 'H2' };

exports.public = secondheader;
exports.private = Object.assign({}, secondheader, { exclusive: true });
