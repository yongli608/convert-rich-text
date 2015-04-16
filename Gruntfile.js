module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      files: [
        '**/*.js',
        'Gruntfile.js',
        '!node_modules/**/*',
        '!build/**/*'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // remove all previous browserified builds
    clean: {
      build: ['./build/**/*']
    },

    // browserify everything
    browserify: {
      // This browserify build be used by users of the module. It contains a
      // UMD (universal module definition) and can be used via an AMD module
      // loader like RequireJS or by simply placing a script tag in the page,
      // which registers mymodule as a global var. You can see examples for both
      // usages in browser/example/index.html (script tag) and
      // browser/example/index-require.html (RequireJS).
      standalone: {
        src: [ '<%= pkg.main %>' ],
        dest: './build/<%= pkg.name %>.standalone.js',
        options: {
          watch: true,
          browserifyOptions: {
            standalone: '<%= pkg.name %>'
          }
        }
      },
      // This browserify build can be required by other browserify modules that
      // have been created with an --external parameter. See
      // browser/test/index.html for an example.
      require: {
        src: [ '<%= pkg.main %>' ],
        dest: './build/<%= pkg.name %>.require.js',
        options: {
          alias: [ '<%= pkg.main %>:<%= pkg.name %>' ],
          watch: true
        }
      },
      // These are the browserified tests. We need to browserify the tests to be
      // able to run the mocha tests while writing the tests as clean, simple
      // CommonJS mocha tests (that is, without cross-platform boilerplate
      // code). This build will also include the testing libs chai, sinon and
      // sinon-chai but must not include the module under test.
      tests: {
        src: [ 'test/**/*.js' ],
        dest: './build/tests.js',
        options: {
          external: [ '<%= pkg.name %>' ],
          watch: true,
          // Embed source map for tests
          debug: true
        }
      }
    },

    // Uglify browser libs
    uglify: {
      dist: {
        files: {
          '<%= browserify.standalone.dest.replace(".js", ".min.js") %>':
              ['<%= browserify.standalone.dest %>'],
          '<%= browserify.require.dest.replace(".js", ".min.js") %>':
              ['<%= browserify.require.dest %>'],
        }
      }
    },

    connect: {
      // Used for mocha-phantomjs tests
      server: {},

      // you can use this manually by doing
      // grunt connect:keepalive
      // to start a server for the example pages (browser/example/*.html) or to
      // run the tests manually in a browser
      keepalive: {
        options: {
          keepalive: true
        }
      }
    },

    // run the mocha tests in the browser via PhantomJS
    mocha_phantomjs: {
      all: {
        options: {
          urls: [
            'http://127.0.0.1:8000/test/index.html'
          ]
        }
      }
    },

    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['default']
    },
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-mocha-phantomjs');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', [
    'jshint',
    'clean',
    'browserify',
    'uglify',
    'connect:server',
    'mocha_phantomjs'
  ]);
};
