module.exports = function(grunt) {

    "use strict";

    /**
     * config
     */

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        clean: {
            stitches: {
                src: ["amd/", "build/", "docs/"]
            },
            pages: {
                src: ["stitches/"]
            }
        },

        jshint: {
            stitches: {
                src: ["src/js/**/*.js"]
            }
        },

        qunit: {
            stitches: {
                src: ["test/unit/**/*.js"]
            }
        },

        replace: {
            version: {
                options: {
                    variables: {
                        version: "<%= pkg.version %>"
                    }
                },
                files: [
                    {
                        src: "templates/README.md",
                        dest: "README.md"
                    }
                ]
            },
            pages: {
                options: {
                    variables: {
                        version: "<%= pkg.version %>"
                    }
                },
                files: [
                    {
                        src: "../gh-pages/<%= pkg.name %>/templates/index.md",
                        dest: "../gh-pages/<%= pkg.name %>/index.md"
                    }
                ]
            }
        },

        docker: {
            files: {
                expand: true,
                src: "**/*.js",
                dest: "../../docs",
                options: {
                    onlyUpdated: false,
                    fileSearch: true
                }
            }
        },

        requirejs: {
            compile: {
                options: {
                    appDir: "src",
                    baseUrl: "js",
                    dir: "amd",
                    modules: [
                        {
                            name: "stitches"
                        }
                    ],
                    paths: {
                        "libs": "../libs",
                        "tpl" : "../tpl"
                    }
                }
            }
        },

        concat: {
            js: {
                src: ["amd/require.js", "amd/js/<%= pkg.name %>.js"],
                dest: "build/<%= pkg.name %>/js/<%= pkg.name %>-<%= pkg.version %>.js"
            },
            css: {
                src: ["amd/css/<%= pkg.name %>.css"],
                dest: "build/<%= pkg.name %>/css/<%= pkg.name %>-<%= pkg.version %>.css"
            }
        },

        cssmin: {
            compress: {
                files: [
                    {
                        src: "build/<%= pkg.name %>/css/<%= pkg.name %>-<%= pkg.version %>.css",
                        dest: "build/<%= pkg.name %>/css/<%= pkg.name %>-<%= pkg.version %>.min.css"
                    }
                ]
            }
        },

        uglify: {
            compress: {
                files: [
                    {
                        src: "build/<%= pkg.name %>/js/<%= pkg.name %>-<%= pkg.version %>.js",
                        dest: "build/<%= pkg.name %>/js/<%= pkg.name %>-<%= pkg.version %>.min.js"
                    }
                ]
            }
        },

        copy: {
            stitches: {
                files: [
                    {
                        expand: true,
                        cwd: "src/img/",
                        src: "**",
                        dest: "build/<%= pkg.name %>/img/"
                    },
                    {
                        expand: true,
                        src: "libs/**",
                        dest: "build/"
                    }
                ]
            },
            pages: {
                files: [
                    {
                        expand: true,
                        src: "build/**",
                        dest: "../gh-pages/<%= pkg.name %>/stitches/"
                    },
                    {
                        expand: true,
                        src: "dist/**",
                        dest: "../gh-pages/<%= pkg.name %>/stitches/"
                    },
                    {
                        expand: true,
                        src: "docs/**",
                        dest: "../gh-pages/<%= pkg.name %>/stitches/"
                    },
                    {
                        expand: true,
                        src: "test/**",
                        dest: "../gh-pages/<%= pkg.name %>/stitches/"
                    },
                ]
            }
        },

        zip: {
            dist: {
                src: "**",
                dest: "../dist/<%= pkg.name %>-<%= pkg.version %>.zip"
            }
        },

        rebase: {
            stitches: {
                dir: process.cwd()
            },
            pages: {
                dir: "../gh-pages/<%= pkg.name %>/"
            },
            build: {
                dir: "build/"
            },
            srcjs: {
                dir: "src/js/"
            }
        },

        commit: {
            stitches: {
                branch: "master"
            },
            pages: {
                branch: "gh-pages"
            }
        }
    });

    /**
     * load node modules
     */

    grunt.loadTasks("tasks");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-qunit");
    grunt.loadNpmTasks("grunt-replace");
    grunt.loadNpmTasks("grunt-docker");
    grunt.loadNpmTasks("grunt-contrib-requirejs");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-zip");
    grunt.loadNpmTasks("grunt-bump");

    /**
     * master tasks
     */

    grunt.registerTask("validate", [
        "jshint"/*,
        "qunit",*/
    ]);

    grunt.registerTask("docs", [
        "rebase:srcjs",
        "docker",
        "rebase:stitches"
    ]);

    grunt.registerTask("build", [
        "requirejs",
        "concat",
        "cssmin",
        "uglify",
        "copy:stitches"
    ]);

    grunt.registerTask("dist", [
        "rebase:build",
        "zip",
        "rebase:stitches"
    ]);

    grunt.registerTask("stitches", [
        "replace:version",
        "clean:stitches",
        "validate",
        "docs",
        "build",
        "dist",
        "commit:stitches"
    ]);

    /**
     * gh-pages tasks
     */

    grunt.registerTask("pages", [
        "rebase:pages",
        "clean:pages",
        "rebase:stitches",
        "copy:pages",
        "replace:pages",
        "rebase:pages",
        "commit:pages",
        "rebase:stitches"
    ]);

    /**
     * default
     */

    grunt.registerTask("default", "stitches pages bump");
};