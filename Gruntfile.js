module.exports = function(grunt) {

    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        clean: {
            build: ["amd/", "build/", "docs/", "out/"]
        },

        jshint: {
            all: ["src/js/**/*.js"]
        },

        qunit: {
            all: ["tests/unit/**/*.js"]
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
                        src: "_templates/README.md",
                        dest: "README.md"
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
                command: "git commit -m \"Build <%= pkg.version %> - <%= message %>\"",
                stdout: true
            },
            gitPush: {
                command: "git push origin master",
                stdout: true
            }
        },

        requirejs: {
            compile: {
                options: {
                    appDir: "src",
                    baseUrl: "js",
                    dir: "amd",
                    //optimize: "closure",

                    modules: [
                        {
                            name: "stitches"
                        }
                    ],

                    paths: {
                        "lib": "../lib",
                        "tpl" : "../tpl",
                        "jquery": "wrap/jquery",
                        "modernizr": "wrap/modernizr"
                    }
                }
            }
        },

        concat: {
            js: {
                src: ["amd/require.js", "amd/js/<%= pkg.repo %>.js"],
                dest: "build/<%= pkg.repo %>/js/<%= pkg.repo %>-<%= pkg.version %>.js"
            },
            css: {
                src: ["amd/css/<%= pkg.repo %>.css"],
                dest: "build/<%= pkg.repo %>/css/<%= pkg.repo %>-<%= pkg.version %>.css"
            }
        },

        cssmin: {
            compress: {
                files: [
                    {
                        src: "build/<%= pkg.repo %>/css/<%= pkg.repo %>-<%= pkg.version %>.css",
                        dest: "build/<%= pkg.repo %>/css/<%= pkg.repo %>-<%= pkg.version %>.min.css"
                    }
                ]
            }
        },

        uglify: {
            compress: {
                files: [
                    {
                        src: "build/<%= pkg.repo %>/js/<%= pkg.repo %>-<%= pkg.version %>.js",
                        dest: "build/<%= pkg.repo %>/js/<%= pkg.repo %>-<%= pkg.version %>.min.js"
                    }
                ]
            }
        },

        copy: {
            dependencies: {
                files: [
                    /*{
                        src: "**",
                        dest: "build/<%= pkg.repo %>/img/",
                        cwd: "src/img/"
                    },*/
                    {
                        src: "lib/**",
                        dest: "build/"
                    }
                ]
            }
        },

        zip: {
            distribution: {
                src: "build/**",
                dest: "dist/<%= pkg.repo %>-<%= pkg.version %>.zip"
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


    grunt.registerTask("commit-message", "Enter a git commit message", function () {
        global.message = grunt.option("m");

        if (!global.message) {
            grunt.fail.fatal("The commit task requires a message passed in the -m parameter.")
        }
    });


    grunt.registerTask("validate", ["jshint"/*, "qunit"*/]);
    grunt.registerTask("docs", ["replace:version", "exec:docker"]);
    grunt.registerTask("build", ["clean", "docs", "requirejs", "concat", "cssmin", "uglify", "copy", "zip"]);
    grunt.registerTask("commit", ["commit-message", "exec:gitAdd", "exec:gitCommit", "exec:gitPush"]);

    grunt.registerTask("deploy", ["validate", "docs", "build", "commit"]);
    grunt.registerTask("pages", ["buildPages", "commitPages"]);
    grunt.registerTask("default", ["deploy"]);
};