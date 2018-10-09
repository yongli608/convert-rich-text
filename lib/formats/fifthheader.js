var fifthheader = { type: 'line', tag: 'H5' };

exports.public = fifthheader;
exports.private = Object.assign({}, fifthheader, { exclusive: true });
