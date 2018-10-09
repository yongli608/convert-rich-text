var fourthheader = { type: 'line', tag: 'H4' };

exports.public = fourthheader;
exports.private = Object.assign({}, fourthheader, { exclusive: true });
