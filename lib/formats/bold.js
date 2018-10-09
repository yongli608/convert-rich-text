var bold = { tag: 'STRONG' };

exports.public = bold;
exports.private = Object.assign({}, bold, { prepare: 'bold' });
