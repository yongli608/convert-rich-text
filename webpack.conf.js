module.exports = {
  progress: false,
  output: {
    path: __dirname + '/build',
    publicPath: '/js/',
    filename: 'bundle.js'
  },
  devtool: 'source-map',
};
