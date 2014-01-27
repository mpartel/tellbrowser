module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      build: {
        src: [
          'node_modules/node-uuid/uuid.js',
          'node_modules/cookies-js/src/cookies.js',
          'client/tellbrowser-client.js'
        ],
        dest: 'public/lib/tellbrowser-client.min.js'
      }
    },
    copy: {
      demo: {
        expand: true,
        src: 'demo/**',
        dest: 'public'
      },
      jquery: {
        src: 'bower_components/jquery/jquery.min.js',
        dest: 'public/lib/jquery/jquery.min.js'
      },
      notifyjs: {
        src: 'bower_components/notifyjs-dist/notify-combined.min.js',
        dest: 'public/lib/notifyjs/notify-combined.min.js'
      },
      bootstrap: {
        expand: true,
        cwd: 'bower_components/bootstrap/dist',
        src: '**',
        dest: 'public/lib/bootstrap/'
      }
    },
    watch: {
      all: {
        files: ['client/**', 'demo/**', 'Gruntfile.js'],
        tasks: ['default']
      }
    },
    clean: {
      all: {
        src: 'public'
      }
    }
  });

  [
    'grunt-contrib-uglify',
    'grunt-contrib-copy',
    'grunt-contrib-clean',
    'grunt-contrib-watch'
  ].forEach(function (dep) {
    grunt.loadNpmTasks(dep);
  });

  // Default task(s).
  grunt.registerTask('default', ['uglify', 'copy']);
};