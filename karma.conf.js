module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'chai'],
    files: ['test/client/*.js'],
    preprocessors: {
      'test/client/*.js': ['webpack']
    },
    reporters: ['dots'],
    browsers: ['ChromeHeadless'],
    port: 9876,
    colors: true,
    webpack: { mode: 'development' },
    webpackMiddleware: { stats: 'errors-only' },
    singleRun: true
  });
};
