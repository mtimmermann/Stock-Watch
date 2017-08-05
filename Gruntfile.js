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

  var jsApp = ['client/js/services/*.js', 'client/js/*.js'];

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
    // npm install --save-dev babel-cli babel-preset-react
    browserify: {
      // main: {
      //   options: {
      //     transform: [['babelify', { presets: ['es2015', 'react'] }]],
      //     browserifyOptions: {
      //       debug: true
      //     }
      //   },
      //   src: ['client/jsx/*.jsx'],
      //   dest: 'public/js/templates/templates-jsx.compiled',
      // }
      main: {
        options: {
          transform: [['babelify', { presets: ['es2015', 'react'] }]],
          browserifyOptions: {
            debug: true
          }
        },
        files: [
          {'public/js/templates/stock-names-section-jsx.compiled': ['client/jsx/stock-names-section.jsx']}
        ]
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
          'public/js/scripts.js': [jsApp]
        }
      },
      build: {
        options: {
          sourceMap: true
        },
        files: {
          'public/js/scripts.js': [jsApp]
        }
      },

      // requirejs: {
      //   files: {
      //     'public/js/dependencies/require.min.js': ['bower_components/requirejs/require.js']
      //   }
      // },

      dev_react_jsx: {
        options: {
          beautify: true,
          mangle: false,
          compress: false,
          preserveComments: 'all'
        },
        // files: [{
        //   expand: false,
        //   src: ['public/js/templates/templates-jsx.compiled'],
        //   //dest: ''
        //   dest: 'public/js/templates/templates.js'
        // }]
        files: [
          {
            src: ['public/js/templates/stock-names-section-jsx.compiled'],
            dest: 'public/js/templates/stock-names-section.js'
          }
        ]
      },
      build_react_jsx: {
        options: {
          sourceMap: true
        },
        files: [
          {
            src: ['public/js/templates/stock-names-section-jsx.compiled'],
            dest: 'public/js/templates/stock-names-section.js'
          }
        ]
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
        files: [jsApp],
        tasks: ['jshint', 'uglify:dev']
      },
      css: {
        files: ['client/scss/*.scss'],
        tasks: ['sass:dev']
      },
      jsx: {
        files: ['client/jsx/*.jsx'],
        tasks: ['browserify', 'uglify:dev_react_jsx']
      }
    }

  });

  //grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', [
    'jshint',
    'clean',
    'copy',
    'browserify',           // Translate react .jsx files to js
    'uglify:dev',           // Application js files, beutify and combine
    //'uglify:requirejs',     // Minify requirejs
    'uglify:dev_react_jsx', // Translated React .jsx->js files, beutify and combine
    'sass:dev'              // Compile Sass styles
  ]);
  grunt.registerTask('build', [
    'jshint',
    'clean',
    'copy',
    'browserify',             // Translate react .jsx files to js
    'uglify:build',           // Application js files, minimize
    //'uglify:requirejs',       // Minify requirejs
    'uglify:build_react_jsx', // Translate React .jsx->js files, minimize
    'sass:dev'                // Compile and minify Sass styles
  ]);
};
