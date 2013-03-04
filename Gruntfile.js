module.exports = function(grunt) {

    "use strict";

    /**
     * config
     */

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        clean: {
            repo: ["amd/", "build/", "docs/"],
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

        docker: {
            files: {
                expand: true,
                src: "**/*.js",
                dest: "../../docs",
                options: {
                    onlyUpdated: false
                }
            }
        },

        exec: {
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
            dist: {
                src: "**",
                dest: "../dist/<%= pkg.name %>-<%= pkg.version %>.zip"
            }
        },

        rebase: {
            repo: {
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
        }
    });

    /**
     * load node modules
     */

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-qunit");
    grunt.loadNpmTasks("grunt-replace");
    grunt.loadNpmTasks("grunt-docker");
    grunt.loadNpmTasks("grunt-exec");
    grunt.loadNpmTasks("grunt-contrib-requirejs");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-zip");
    grunt.loadNpmTasks("grunt-bump");

    /**
     * register custom tasks
     */

    grunt.registerMultiTask("rebase", "Rebase cwd", function () {
        var dir = this.data.dir;

        grunt.file.setBase(dir);
        grunt.log.ok("Base dir is now " + process.cwd());
    });

    grunt.registerTask("commit-message", "Enter a git commit message", function () {
        var done;
        var prompt;

        if (!global.message) {
            done = this.async();
            prompt = require("prompt");

            grunt.log.writeln("Please enter a commit message.");
            prompt.start();
            prompt.get(["msg"], function (err, result) {
                if (err || !result.msg) {
                    grunt.fail.fatal("The commit task requires a message.");
                }

                global.message = result.msg;
                done();
            });
        }
    });

    /**
     * master tasks
     */

    grunt.registerTask("validate", [
        "jshint"/*,
        "qunit"*/
    ]);

    grunt.registerTask("docs", [
        "replace:version",
        "rebase:srcjs",
        "docker",
        "rebase:repo"
    ]);

    grunt.registerTask("compress", [
        "rebase:build",
        "zip",
        "rebase:repo"
    ]);

    grunt.registerTask("build-repo", [
        "docs",
        "requirejs",
        "concat",
        "cssmin",
        "uglify",
        "copy:dependencies",
        "compress"
    ]);

    grunt.registerTask("commit-repo", [
        "commit-message",
        "exec:gitAdd",
        "exec:gitCommit",
        "exec:gitPush"
    ]);

    grunt.registerTask("repo", [
        "clean:repo",
        "validate",
        "docs",
        "build-repo",
        "commit-repo"
    ]);

    /**
     * gh-pages tasks
     */

    grunt.registerTask("build-pages", [
        "rebase:pages",
        "clean:pages",
        "rebase:repo",
        "copy:pages",
        "replace:pages"
    ]);

    grunt.registerTask("commit-pages", [
        "commit-message",
        "rebase:pages",
        "exec:gitAddPages",
        "exec:gitCommitPages",
        "exec:gitPushPages",
        "rebase:repo"
    ]);

    grunt.registerTask("pages", [
        "build-pages",
        "commit-pages"
    ]);

    /**
     * default
     */

    grunt.registerTask("default", [
        "repo",
        "pages"
    ]);
};