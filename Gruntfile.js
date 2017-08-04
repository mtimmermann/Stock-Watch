'use strict';

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt); // load all tasks
  //require('time-grunt')(grunt); // Time grunt process

  var jsLibs = [
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js',
    'bower_components/react/react.min.js',
    'bower_components/react/react-dom.min.js'
  ];

  var jsApp = ['client/js/*.js'];

  grunt.initConfig({
    //pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        jsApp
      ]
    },

    clean: ['public/css', 'public/js', 'public/js/templates'],

    copy: {
      //main: {
      jsDependencies: {
        files: [
          {
            expand: true, flatten: true,
            src: jsLibs,
            dest: 'public/js/dependencies', filter: 'isFile'
          },
          {
            expand: true, flatten: true,
            src: ['client/js/dependencies/highcharts/*.js'],
            dest: 'public/js/dependencies/highcharts', filter: 'isFile'
          }
        ]
      }
    },

    // Transform react .jsx files to js
    // http://chris.house/blog/grunt-configuration-for-react-browserify-babelify/
    // https://stackoverflow.com/questions/41067220/using-babel-grunt-to-work-with-es6-how-to-transform-require-statements
    // npm install --save-dev babel-cli babel-preset-es2015
    browserify: {
      main: {
        options: {
          transform: [['babelify', { presets: ['es2015', 'react'] }]],
          browserifyOptions: {
            debug: true
          }
        },
        src: ['client/jsx/*.jsx'],
        dest: 'public/js/templates/templates-jsx.compiled',
      }
    },

    uglify: {
      dev: {
        options: {
          beautify: true,
          mangle: false,
          compress: false,
          preserveComments: 'all'
        },
        files: {
          'public/js/scripts.js': ['client/js/*.js']
        }
      },
      build: {
        options: {
          sourceMap: true
        },
        files: {
          'public/js/scripts.js': ['client/js/*.js']
        }
      },

      dev_react_jsx: {
        options: {
          beautify: true,
          mangle: false,
          compress: false,
          preserveComments: 'all'
        },
        files: [{
          expand: false,
          src: ['public/js/templates/templates-jsx.compiled'],
          //dest: ''
          dest: 'public/js/templates/templates.js'
        }]
      },
      build_react_jsx: {
        options: {
          sourceMap: true
        },
        files: [{
          expand: false,
          src: ['public/js/templates/templates-jsx.compiled'],
          //dest: ''
          dest: 'public/js/templates/templates.js'
        }]
      }
    },

    sass: {
      dev: {
        options: {
          outputStyle: 'expanded',
          includePaths: ['bower_components/bootstrap-sass/assets/stylesheets']
        },
        files: {
          'public/css/style.css': 'client/scss/style.scss'
        }
      },
      build: {
        options: {
          outputStyle: 'compressed',
          includePaths: ['bower_components/bootstrap-sass/assets/stylesheets']
        },
        files: {
          'public/css/style.css': 'client/scss/style.scss'
        }
      }
    },

    watch: {
      js: {
        files: ['client/js/*.js'],
        tasks: ['uglify:dev']
      },
      css: {
        files: ['client/scss/*.scss'],
        tasks: ['sass:dev']
      },
      jsx: {
        files: ['client/jsx/*.jsx'],
        tasks: ['browserify:build', 'uglify:dev_react_jsx']
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint', 'clean', 'copy', 'browserify', 'uglify:dev', 'uglify:dev_react_jsx', 'sass:dev']);
  grunt.registerTask('build', ['jshint', 'clean', 'copy', 'browserify', 'uglify:build', 'uglify:build_react_jsx', 'sass:dev']);
};
