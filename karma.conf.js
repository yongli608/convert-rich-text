var webpackConfig = require('./webpack.conf');

module.exports = function(config) {
  config.set({
    basePath: '',
    browsers: ['PhantomJS'],
    frameworks: ['mocha', 'chai', 'phantomjs-shim'],
    plugins: [
      'karma-phantomjs-shim',
      'karma-phantomjs-launcher',
      'karma-webpack',
      'karma-mocha',
      'karma-chai'
    ],
    files: ['test/client/*.js'],
    preprocessors: {
      'test/client/*.js': ['webpack']
    },
    reporters: ['dots'],
    webpack: webpackConfig,
    webpackMiddleware: { noInfo: true },
    singleRun: true
  });
}
