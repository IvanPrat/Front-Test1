module.exports = function(grunt) {
  grunt.initConfig({
    sass: {
      dist: {
        files: {
          'dist/css/styles.css': 'scss/styles.scss'
        }
      }
    },
    concat: {
      basic_and_extras: {
        files: {
          'dist/css/styles.css': ['bower_components/normalize.css/normalize.css', 'dist/css/styles.css'],
        },
      },
    },
    uglify: {
      target: {
        files: {
          'dist/js/jquery.min.js': ['bower_components/jquery/jquery.min.js'],
          'dist/js/myBasket.min.js': ['js/myBasket.js'],
          'dist/js/main.min.js': ['js/main.js']
        }
      }
    },
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'dist/css',
          src: ['*.css', '!*.min.css'],
          dest: 'dist/css',
          ext: '.min.css'
        }]
      }
    }
  });


  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['sass', 'concat', 'cssmin', 'uglify']);
};
