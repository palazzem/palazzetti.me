'use strict';

module.exports = function(grunt) {

  // Grunt tasks
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  // Assemble build
  grunt.loadNpmTasks('assemble');

  // Project configuration.
  grunt.initConfig({

    config: {
      src: 'src',
      dist: 'dist'
    },

    watch: {
      assemble: {
        files: ['<%= config.src %>/{content,data,templates}/{,*/}*.{md,hbs,yml}'],
        tasks: ['assemble']
      },
      compass: {
        files: ['<%= config.src %>/sass/{,*/}*.{scss,sass}'],
        tasks: ['compass:server', 'autoprefixer']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '.tmp/*.html',
          '.tmp/css/{,*/}*.css',
          '<%= config.dist %>/{,*/}*.html',
          '<%= config.dist %>/assets/{,*/}*.css',
          '<%= config.dist %>/assets/{,*/}*.js',
          '<%= config.dist %>/assets/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    connect: {
      options: {
        port: 9000,
        livereload: 35729,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          open: true,
          base: [
            '.tmp',
            '<%= config.dist %>'
          ]
        }
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        loadAll: '<%= config.src %>/assets/gumby/sass/extensions',
        sassDir: '<%= config.src %>/sass',
        cssDir: '.tmp/css',
        generatedImagesDir: '.tmp/img/generated',
        imagesDir: '<%= config.src %>/img',
        fontsDir: '<%= config.src %>/fonts',
        importPath: '<%= config.src %>/assets',
        httpImagesPath: '/img',
        httpGeneratedImagesPath: '/img/generated',
        httpFontsPath: '/css/fonts',
        relativeAssets: true,
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      dist: {
        options: {
          generatedImagesDir: '<%= config.dist %>/img/generated'
        }
      },
      server: {
        options: {
          debugInfo: true
        }
      }
    },

    // Add vendor prefixed css
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: '.tmp/css/',
            src: '{,*/}*.css',
            dest: '.tmp/css/'
          }
        ]
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= config.dist %>/js/{,*/}*.js',
            '<%= config.dist %>/css/{,*/}*.css',
            '<%= config.dist %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= config.dist %>/css/fonts/*'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '.tmp/index.html',
      options: {
        dest: '<%= config.dist %>'
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= config.dist %>/{,*/}*.html'],
      css: ['<%= config.dist %>/css/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= config.dist %>']
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= config.src %>/img',
            src: '{,*/}*.{png,jpg,jpeg,gif}',
            dest: '<%= config.dist %>/img'
          }
        ]
      }
    },
    svgmin: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= config.src %>/img',
            src: '{,*/}*.svg',
            dest: '<%= config.dist %>/img'
          }
        ]
      }
    },
    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [
          {
            expand: true,
            cwd: '<%= config.dist %>',
            src: '*.html',
            dest: '<%= config.dist %>'
          }
        ]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '<%= config.src %>',
            dest: '<%= config.dist %>',
            src: [
              '*.{ico,png,txt}',
              'img/{,*/}*.{webp}',
              'fonts/*',
              'CNAME'
            ]
          },
          {
            expand: true,
            cwd: '.tmp',
            dest: '<%= config.dist %>',
            src: '*.html'
          },
          {
            expand: true,
            cwd: '.tmp/img',
            dest: '<%= config.dist %>/img',
            src: ['generated/*']
          },
          {
            expand: true,
            cwd: '<%= config.src %>/assets/gumby/fonts/',
            dest: '<%= config.dist %>/fonts',
            src: '**'
          }
        ]
      },
      dev: {
        files: [
          {
            expand: true,
            cwd: '<%= config.src %>/assets/gumby/fonts/',
            dest: '.tmp/fonts/',
            src: '**'
          }
        ]
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'compass:server',
        'assemble'
      ],
      dist: [
        'compass:dist',
        'assemble',
        'imagemin',
        'svgmin'
      ]
    },

    assemble: {
      pages: {
        options: {
          flatten: true,
          layout: 'default.hbs',
          layoutdir: '<%= config.src %>/templates/layouts',
          assets: '<%= config.dist %>/assets',
          partials: '<%= config.src %>/templates/partials/*.hbs',
          plugins: ['assemble-contrib-permalinks','assemble-contrib-sitemap'],
        },
        files: {
          '.tmp/': ['<%= config.src %>/templates/pages/*.hbs']
        }
      }
    },

    // Before generating any new files,
    // remove any previously-created files.

    clean: {
      dist: {
        files: [
          {
            dot: true,
            src: [
              '.tmp',
              '<%= config.dist %>/*',
              '!<%= config.dist %>/.git*'
            ]
          }
        ]
      },
      server: '.tmp'
    },

    // Automatically create/push gh-pages
    'gh-pages': {
      options: {
        base: 'dist'
      },
      src: ['**']
    }

  });

  grunt.registerTask('server', [
    'clean',
    'concurrent:server',
    'copy:dev',
    'autoprefixer',
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('build', [
    'clean',
    'concurrent:dist',
    'useminPrepare',
    'autoprefixer',
    'concat',
    'copy:dist',
    'cssmin',
    // 'uglify',
    'rev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('deploy', [
    'build',
    'gh-pages'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);

};
