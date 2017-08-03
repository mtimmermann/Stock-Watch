'use strict';

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt); // load all tasks
  //require('time-grunt')(grunt); // Time grunt process

  var jsLibs = [
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/bootstrap-sass/javascripts/js/bootstrap.min.js'
  ];

  var jsApp = ['client/js/*.js'];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        jsApp
      ]
    },

    clean: ['public/css', 'public/js'],

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
    }


  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint', 'clean', 'copy', 'uglify:dev', 'sass:dev']);
  grunt.registerTask('build', ['jshint', 'clean', 'copy', 'uglify:build', 'sass:build']);

};
