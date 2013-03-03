module.exports = function(grunt) {

    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        clean: {
            build: ["amd/", "build/", "docs/"],
            pages: ["repo/"]
        },

        jshint: {
            all: ["src/js/**/*.js"]
        },

        qunit: {
            all: ["test/unit/**/*.js"]
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

        exec: {
            docker: {
                command: "docker -i src/js -o docs",
                stdout: true
            },
            gitAdd: {
                command: "git add .",
                stdout: true
            },
            gitCommit: {
                command: function () {
                    var pkg = require("./package.json");

                    return "git commit -am \"Build " + pkg.version + " - " + global.message + "\"";
                },
                stdout: true
            },
            gitPush: {
                command: "git push origin master",
                stdout: true
            },
            gitAddPages: {
                command: "git add .",
                stdout: true
            },
            gitCommitPages: {
                command: function () {
                    var pkg = require("./package.json");

                    return "git commit -am \"Pages " + pkg.version + " - " + global.message + "\"";
                },
                stdout: true
            },
            gitStatusPages: {
                command: "ls && git status",
                stdout: true
            },
            gitPushPages: {
                command: "git push origin gh-pages",
                stdout: true
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
                        "tpl" : "../tpl",
                        "jquery": "wrap/jquery",
                        "modernizr": "wrap/modernizr"
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
            dependencies: {
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
                        dest: "../gh-pages/<%= pkg.name %>/repo/"
                    },
                    {
                        expand: true,
                        src: "dist/**",
                        dest: "../gh-pages/<%= pkg.name %>/repo/"
                    },
                    {
                        expand: true,
                        src: "docs/**",
                        dest: "../gh-pages/<%= pkg.name %>/repo/"
                    },
                    {
                        expand: true,
                        src: "test/**",
                        dest: "../gh-pages/<%= pkg.name %>/repo/"
                    },
                ]
            }
        },

        zip: {
            distribution: {
                src: "build/**",
                dest: "dist/<%= pkg.name %>-<%= pkg.version %>.zip"
            }
        }
    });


    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-qunit");
    grunt.loadNpmTasks("grunt-replace");
    grunt.loadNpmTasks("grunt-exec");
    grunt.loadNpmTasks("grunt-contrib-requirejs");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-zip");
    grunt.loadNpmTasks("grunt-bump");


    grunt.registerTask("commit-message", "Enter a git commit message", function () {
        global.message = grunt.option("m");

        if (!global.message) {
            grunt.fail.fatal("The commit task requires a message passed in the -m parameter.")
        }
    });

    grunt.registerTask("rebase-build", "Rebase cwd to build dir", function () {
        var pkg = require("./package.json");
        var build = "../../" + pkg.name;

        grunt.file.setBase(build);
    });

    grunt.registerTask("rebase-pages", "Rebase cwd to gh-pages dir", function () {
        var pkg = require("./package.json");
        var pages = "../gh-pages/" + pkg.name;

        grunt.file.setBase(pages);
    });

    /**
     * master tasks
     */

    grunt.registerTask("validate", ["jshint"/*, "qunit"*/]);

    grunt.registerTask("docs", ["replace:version", "exec:docker"]);

    grunt.registerTask("build", ["docs", "requirejs", "concat", "cssmin", "uglify", "copy:dependencies", "zip"]);

    grunt.registerTask("commit", ["commit-message", "exec:gitAdd", "exec:gitCommit", "exec:gitPush"]);

    grunt.registerTask("deploy", ["clean:build", "validate", "docs", "build", "commit"]);

    /**
     * gh-pages tasks
     */

    grunt.registerTask("build-pages", ["rebase-pages", "clean:pages", "rebase-build", "copy:pages", "replace:pages", "commit-pages"]);

    grunt.registerTask("commit-pages", ["commit-message", "rebase-pages", "exec:gitAddPages", "exec:gitStatusPages", "exec:gitCommitPages", "exec:gitPushPages", "rebase-build"]);

    grunt.registerTask("pages", ["build-pages", "commit-pages"]);

    /**
     * default
     */

    grunt.registerTask("default", ["deploy", "pages"]);
};