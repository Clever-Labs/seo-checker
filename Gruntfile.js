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
      bin: 'bin',
      docs: 'docs',
      test: 'test',
      codeName: 'Turkey Gobbler'
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
      dev: ['<%= app.dev %>/**/*.js', '<%= app.bin %>/**/*.js', '<%= app.test %>/test/**/*.js', 'Gruntfile.js']
    },

    // Check for todos
    todos: {
      options: {
        verbose: false
      },
      all: {
        src: ['<%= app.dev %>/**/*.js', 'README.md', '<%= app.test %>/**/*.js', 'Gruntfile.js', 'package.json']
      }
    },

    // Document code
    docco: {
      all: {
        src: ['<%= app.dev %>/**/*.js', '<%= app.test %>/**/*.js'],
        options: {
          output: '<%= app.docs %>/'
        }
      }
    },

    // Run tests
    nodeunit: {
      all: ['<%= app.test %>/*_test.js'],
      options: {
        reporter: 'default',
        //reporterOutput: '<%= app.test %>/results/<%= grunt.template.today("yyyymmdd") %>-test-results.txt'
      }
    },

    // Run shell commands
    shell: {
      publish: {
        command: ['git add .', 'git commit -m "<%= grunt.option("message") %>"', 'npm publish'].join('&&')
      }
    }
  });

  // Default task(s).
  grunt.registerTask('default', ['develop']);

  grunt.registerTask('develop', ['watch']);

  grunt.registerTask('build', [
    'jshint',
    'nodeunit',
    'docco',
    'todos'
    ]);

  grunt.registerTask('publish', ['build', 'shell:publish']);

};
