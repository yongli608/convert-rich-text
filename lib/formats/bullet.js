var bullet = { type: 'line', parentTag: 'UL', tag: 'LI' };

exports.public = bullet;
exports.private = Object.assign({}, bullet, { exclusive: true, inherit: true });
