module.exports = function(grunt) {

    "use strict";

    /**
     * config
     */

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        clean: {
            stitches: {
                src: ["amd/", "build/", "dist/", "src/js/doc/"]
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
                        src: "../gh-pages/stitches/templates/index.md",
                        dest: "../gh-pages/stitches/index.md"
                    }
                ]
            }
        },

        docker: {
            files: {
                expand: true,
                src: "**",
                dest: "doc",
                options: {
                    onlyUpdated: false
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
                src: ["amd/require.js", "amd/js/stitches.js"],
                dest: "build/stitches/js/stitches-<%= pkg.version %>.js"
            },
            css: {
                src: ["amd/css/stitches.css"],
                dest: "build/stitches/css/stitches-<%= pkg.version %>.css"
            }
        },

        cssmin: {
            compress: {
                files: [
                    {
                        src: "build/stitches/css/stitches-<%= pkg.version %>.css",
                        dest: "build/stitches/css/stitches-<%= pkg.version %>.min.css"
                    }
                ]
            }
        },

        uglify: {
            compress: {
                files: [
                    {
                        src: "build/stitches/js/stitches-<%= pkg.version %>.js",
                        dest: "build/stitches/js/stitches-<%= pkg.version %>.min.js"
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
                        dest: "build/stitches/img/"
                    },
                    {
                        expand: true,
                        src: "libs/**",
                        dest: "build/"
                    },
                    {
                        expand: true,
                        cwd: "src/js/doc/",
                        src: "**",
                        dest: "build/doc/"
                    }
                ]
            },
            pages: {
                files: [
                    {
                        expand: true,
                        src: "build/**",
                        dest: "../gh-pages/stitches/stitches/"
                    },
                    {
                        expand: true,
                        src: "dist/**",
                        dest: "../gh-pages/stitches/stitches/"
                    },
                    {
                        expand: true,
                        src: "test/**",
                        dest: "../gh-pages/stitches/stitches/"
                    },
                ]
            }
        },

        zip: {
            dist: {
                src: "**",
                dest: "../dist/stitches-<%= pkg.version %>.zip"
            }
        },

        rebase: {
            stitches: {
                dir: process.cwd()
            },
            pages: {
                dir: "../gh-pages/stitches/"
            },
            build: {
                dir: "build/"
            },
            srcjs: {
                dir: "src/js/"
            }
        },

        push: {
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

    grunt.registerTask("doc", [
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
        "doc",
        "build",
        "dist"
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
        "push:pages",
        "rebase:stitches"
    ]);

    /**
     * default
     */

    grunt.registerTask("default", "stitches");
    grunt.registerTask("ps", "push:stitches");
    grunt.registerTask("p", "pages");
};