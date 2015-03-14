module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    connect: {
      server: {
        options: {
          port: 8090,
          base: '.'
        }
      }
    },

    open: {
      dev: {
        path: 'http://localhost:8090'
      }
    },

    watch: {
      all: {
        files: ['*.html', 'css/*.css', 'js/*.js'],
        options: {
          livereload: true
        }
      },

      sass: {
        files: ['sass/*.scss'],
        tasks: ['sass:dist'],
        options: {
          livereload: true
        }
      }
    },

    sass: {
      dist: {
        files: {
          'css/style.css': 'sass/style.scss'
        }
      }
    },

    copy: {
      dist: {
        files: [{
          src: 'index.html',
          dest: 'dist/index.html'
        }, {
          src: 'js/versions.json',
          dest: 'dist/js/versions.json'
        }]
      }
    },

    cssmin: {
      dist: {
        files: {
          'dist/css/style.css': ['css/style.css']
        }
      }
    },

    uglify: {
      dist: {
        files: {
          'dist/js/main.js': ['js/main.js'],
          'dist/js/chopjs.js': ['js/chopjs.js'],
          'dist/js/chop-bundle.js': ['js/chop-bundle.js']
        }
      }
    },

    imagemin: {
      dist: {
        options: {
          optimizationLevel: 3
        },
        files: {
          'dist/img/icon.png': 'img/icon.png'
        }
      }
    },

    autoprefixer: {
      dist: {
        src: 'css/style.css',
        dest: 'css/style.css'
      }
    },

    ftpush: {
      dist: {
        auth: {
          host: 'feifeihang.info',
          port: 21,
          authKey: 'key'
        },
        src: 'dist/',
        dest: '/public_html/chopjs'
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-ftpush');
  grunt.loadNpmTasks('grunt-autoprefixer');

  grunt.registerTask('serve', ['connect', 'open', 'watch']);
  grunt.registerTask('build', ['copy', 'autoprefixer', 'cssmin', 'uglify', 'imagemin']);
  grunt.registerTask('deploy', ['ftpush']);

};
