'use strict';
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var npmConfig;
    var bowerConfig;
    var yeomanConfig = {
        app: 'app',
        dist: 'dist'
    };

    try {
        npmConfig = grunt.file.readJSON('package.json');
        bowerConfig = grunt.file.readJSON('bower.json');
        console.log('npm: ', npmConfig.name, npmConfig.version);
        console.log('bower: ', bowerConfig.name, bowerConfig.version);
        console.log('yeoman: ', yeomanConfig);
    } catch (e) {
    }

    grunt.initConfig({
        yeoman: yeomanConfig,
        npm: npmConfig,
        watch: {
            coffee: {
                files: ['<%= yeoman.app %>/scripts/{,*/}*.coffee'],
                tasks: ['coffee:dist']
            },
            coffeeTest: {
                files: ['test/spec/{,*/}*.coffee'],
                tasks: ['coffee:test']
            },
            compass: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['compass:server']
            },
            less: {
                files: ['<%= yeoman.app %>/styles/less/*.less'],
                tasks: ['less']
            },
            jade: {
                files: ['<%= yeoman.app %>/views/{,*/}*.jade'],
                tasks: ['jade:server']
            },
            livereload: {
                files: [
                    '<%= yeoman.app %>/{,*/}*.html',
                    '{.tmp,<%= yeoman.app %>}/styles/{,*/}*.css',
                    '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
                    '{.tmp,<%= yeoman.app %>}/{,*/}*.html',
                    '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ],
                tasks: ['livereload']
            }
        },
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, yeomanConfig.app)
                        ];
                    }
                }
            },
            test: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'test')
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                url: 'http://localhost:<%= connect.options.port %>'
            }
        },
        clean: {
            dist: ['<%= yeoman.dist %>'],
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/scripts/**/*.js'
            ]
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
            }
        },
        coffee: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/scripts',
                        src: '{,*/}*.coffee',
                        dest: '.tmp/scripts',
                        ext: '.js'
                    }
                ]
            },
            test: {
                files: [
                    {
                        expand: true,
                        cwd: 'test/spec',
                        src: '{,*/}*.coffee',
                        dest: '.tmp/spec',
                        ext: '.js'
                    }
                ]
            }
        },
        compass: {
            options: {
                sassDir: '<%= yeoman.app %>/styles',
                cssDir: '.tmp/styles',
                imagesDir: '<%= yeoman.app %>/images',
                javascriptsDir: '<%= yeoman.app %>/scripts',
                fontsDir: '<%= yeoman.app %>/styles/fonts',
                importPath: '<%= yeoman.app %>/components',
                relativeAssets: true
            },
            dist: {},
            server: {
                options: {
                    debugInfo: true
                }
            }
        },
        less: {
            server: {
                options: {
                    paths: ['<%= yeoman.app %>/styles/less', '<%= yeoman.app %>/components/bootstrap/less'],
                    yuicompress: true
                },
                files: {
                    '.tmp/styles/mint.css': ['<%= yeoman.app %>/styles/less/bootstrap.less', '<%= yeoman.app %>/styles/less/responsive.less']
                }
            }
//            dist: {
//                options: {
//                    paths: ['<%= yeoman.app %>/styles/less', '<%= yeoman.app %>/components/bootstrap/less'],
//                    yuicompress: true
//                },
//                files: {
//                    '.tmp/styles/mint-min.css': ['<%= yeoman.app %>/styles/less/bootstrap.less', '<%= yeoman.app %>/styles/less/responsive.less']
//                }
//            }
        },
        jade: {
            server: {
                options: {
                    data: { debug: false, title: '<%= npm.name %>' },
                    pretty: true
                },
                files: [
                    {
                        expand: true,
                        cwd: 'app/views',
                        src: ['*.jade', 'partials/*.jade'],
                        dest: '.tmp',
                        ext: '.html'
                    }
                ]
            }
//            dist: {
//                options: {
//                    data: { debug: false, title: '<%= npm.name %>' },
//                    pretty: false
//                },
//                files: [
//                    {
//                        expand: true,
//                        cwd: 'app/views',
//                        src: ['*.jade', 'partials/*.jade'],
//                        dest: 'dist',
//                        ext: '.html'
//                    }
//                ]
//            }
        },
        concat: {
            dist: {
//                files: {
//                    '<%= yeoman.dist %>/scripts/scripts.js': [
//                        '.tmp/scripts/{,*/}*.js',
//                        '<%= yeoman.app %>/scripts/{,*/}*.js'
//                    ]
//                }
            }
        },
        useminPrepare: {
            html: '.tmp/index.html',
            //html: '<%= yeoman.app %>/views/layouts/main.jade',
            options: {
                dest: '<%= yeoman.dist %>'
            }
        },
        usemin: {
            //html: ['<%= yeoman.dist %>/{,*/}*.html'],
            html: ['.tmp/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
            options: {
                dirs: ['<%= yeoman.dist %>'],
                basedir: '<%= yeoman.dist %>'
            }
        },
        imagemin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/images',
                        src: '{,*/}*.{png,jpg,jpeg}',
                        dest: '<%= yeoman.dist %>/images'
                    }
                ]
            }
        },
        cssmin: {
            dist: {
                options: {
                    banner: '/* Minified vanilla CSS */',
                    report: 'min'
                },
                files: {
                    '.tmp/styles/vanilla.css': ['<%= yeoman.app %>/styles/vanilla.css']
                }
            }
        },
        htmlmin: {
            dist: {
                options: { // https://github.com/yeoman/grunt-usemin/issues/44
                    removeComments: false,
                    removeCommentsFromCDATA: false,
                    collapseWhitespace: true,
                    collapseBooleanAttributes: false,
                    removeAttributeQuotes: false,
                    removeRedundantAttributes: false,
                    useShortDoctype: false,
                    removeEmptyAttributes: false,
                    removeOptionalTags: false
                },
                files: [
                    {
                        expand: true,
                        cwd: '.tmp',
                        src: ['*.html', 'partials/*.html'],
                        dest: '<%= yeoman.dist %>'
                    }
                ]
            }
        },
        cdnify: {
            dist: {
                html: ['.tmp/*.html']
            }
        },
        ngmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>/scripts',
                        src: '*.js',
                        dest: '<%= yeoman.dist %>/scripts'
                    }
                ]
            }
        },
        uglify: {
            dist: {
                options: {
                    mangle: true
                },
                files: {
                    '<%= yeoman.dist %>/scripts/st-min.js': [
                        '<%= yeoman.dist %>/scripts/st-min.js'
                    ]
                }
            }
        },
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/scripts/{,*/}*.js',
                        '<%= yeoman.dist %>/styles/{,*/}*.css',
                        '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                        '<%= yeoman.dist %>/styles/fonts/*'
                    ]
                }
            }
        },
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>',
                        dest: '<%= yeoman.dist %>',
                        src: [
                            '*.{ico,txt}',
                            '.htaccess',
//                            'components/**/*',
//                            'images/{,*/}*.{gif,webp}',
//                            'styles/fonts/*'
                        ]
                    }
                ]
            }
        }
    });

    grunt.renameTask('regarde', 'watch');

    grunt.registerTask('server', [
        'clean:server',
        'coffee:dist',
        'compass:server',
        'less',
        'jade:server',
        'livereload-start',
        'connect:livereload',
        'open',
        'watch'
    ]);

    grunt.registerTask('test', [
        'clean:server',
        'coffee',
        'compass',
        'connect:test',
        //'karma'
    ]);

    grunt.registerTask('build', [
        'clean',
        'jshint',
        'test',
        //'coffee',
        //'compass:dist',
        'less',
        'jade',
        'useminPrepare',
        'imagemin',
        'cssmin',
        'concat',
        'copy',
        'cdnify',
        'ngmin',
        'uglify',
        'rev',
        'usemin',
        'htmlmin'
    ]);

    grunt.registerTask('default', ['build']);
};
