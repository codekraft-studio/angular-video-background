/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    banner: '/**\n' +
      '* Package: <%= pkg.name %> - v<%= pkg.version %> \n' +
      '* Description: <%= pkg.description %> \n' +
      '* Last build: <%= grunt.template.today("yyyy-mm-dd") %> \n' +
      '* @author <%= pkg.author %> \n' +
      '* @license <%= pkg.license %> \n'+
      '*/\n',

    jshint: {
      options: {
        node: true,
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        browser: true,
        globals: {
          angular: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      source: {
        src: ['src/**/*.js', 'test/**/*.js']
      }
    },

    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['src/<%= pkg.name %>.module.js', 'src/**/*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },

    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },

    ngAnnotate: {
      options: {
        singleQuotes: true
      },
      dist: {
        files: {
          '<%= concat.dist.dest %>': ['<%= concat.dist.dest %>']
        }
      },
    },

    postcss: {
      options: {
        map: true,
        processors: [
          require('autoprefixer')({browsers: 'last 2 versions'}),
          require('cssnano')()
        ]
      },
      dist: {
        src: 'src/<%= pkg.name %>.css',
        dest: 'dist/<%= pkg.name %>.min.css'
      }
    },

    watch: {

      options: {
        spawn: false,
      },
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['jshint:gruntfile']
      },
      styles: {
        files: 'src/<%= pkg.name %>.css',
        tasks: ['postcss']
      },
      source: {
        files: 'src/**/*.js',
        tasks: ['newer:jshint', 'concat', 'ngAnnotate', 'uglify'],
        options: {
          livereload: true,
        }
      }

    },
    
    connect: {
      server: {
        options: {
          port: 8000,
          open: true,
          hostname: 'localhost',
          livereload: true
        }
      }
    }

  });

  // JS Hint
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-newer');

  // Concat & Uglify
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Styles
  grunt.loadNpmTasks('grunt-postcss');

  // Serve & Watch for file changes
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // AngularJs
  grunt.loadNpmTasks('grunt-ng-annotate');

  // Default task.
  grunt.registerTask('default', ['connect', 'watch']);

  // Build task(s)
  grunt.registerTask('build', ['newer:jshint', 'concat', 'ngAnnotate', 'uglify', 'postcss']);

};
