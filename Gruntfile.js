module.exports = function(grunt) {

  // Time Grunt tasks
  require('time-grunt')(grunt);

  // Autoload Grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    app: {
      dev: 'src',
      dist: 'dist',
      test: 'test',
      codeName: 'Snake Oil'
    },

    // Watch for changes
    watch: {
      options: {
        debounceDelay: 250
      },
      scripts: {
        files: ['<%= app.dev %>/**/*.js', 'Gruntfile.js'],
        tasks: ['jshint:dev']
      },
      tests: {
        files: ['<%= app.test %>/**/*.js'],
        tasks: ['nodeunit']
      }
    },

    // JSHint
    jshint: {
      options: {
        reporter: require('jshint-stylish')
      },
      dev: ['<%= app.dev %>/**/*.js', '<%= app.test %>/test/**/*.js', 'Gruntfile.js']
    },

    // Check for todos
    todos: {
      options: {
        verbose: false
      },
      src: ['<%= app.dev %>/**/*.js', 'README.md', '<%= app.test %>/**/*.js', 'Gruntfile.js', 'package.json']
    },

    // Run tests
    nodeunit: {
      all: ['<%= app.test %>/*_test.js'],
      options: {
        reporter: 'default',
        reporterOutput: '<%= app.test %>/results/<%= grunt.template.today("yyyymmdd") %>-test-results.txt'
      }
    }
  });

  // Default task(s).
  grunt.registerTask('default', ['develop']);

  grunt.registerTask('develop', ['watch']);

  grunt.registerTask('build', []);

  grunt.registerTask('publish', []);

};
