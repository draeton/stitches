module.exports = function(grunt) {

    "use strict";

    /**
     * config
     */

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        clean: {
            module: {
                src: ["amd/", "build/", "dist/"]
            },
            pages: {
                src: ["<%= pkg.name %>/", "tmp/"]
            }
        },

        jshint: {
            module: {
                src: ["src/js/**/*.js"]
            }
        },

        qunit: {
            module: {
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
                        src: "templates/index.md",
                        dest: "index.md"
                    }
                ]
            }
        },

        docker: {
            files: {
                expand: true,
                src: "**/*.js",
                dest: "../../doc",
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
                            name: "<%= pkg.name %>"
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
            module: {
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
                    },
                    {
                        expand: true,
                        cwd: "src/js/doc/",
                        src: "**",
                        dest: "build/doc/"
                    }
                ]
            },
            pagespre: {
                files: [
                    {
                        expand: true,
                        src: ["build/**", "dist/**", "doc/**", "test/**"],
                        dest: "tmp/"
                    }
                ]
            },
            pagespost: {
                files: [
                    {
                        expand: true,
                        cwd: "tmp/",
                        src: "**",
                        dest: "<%= pkg.name %>/"
                    }
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
            module: {
                dir: process.cwd()
            },
            build: {
                dir: "build/"
            },
            srcjs: {
                dir: "src/js/"
            }
        },

        checkout: {
            module: {
                branch: "<%= pkg.baseBranch %>"
            },
            pages: {
                branch: "gh-pages"
            }
        },

        push: {
            module: {
                branch: "<%= pkg.baseBranch %>"
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
        "rebase:module"
    ]);

    grunt.registerTask("build", [
        "requirejs",
        "concat",
        "cssmin",
        "uglify",
        "copy:module"
    ]);

    grunt.registerTask("dist", [
        "rebase:build",
        "zip",
        "rebase:module"
    ]);

    grunt.registerTask("module", [
        "replace:version",
        "clean:module",
        "validate",
        "doc",
        "build",
        "dist"
    ]);

    /**
     * gh-pages tasks
     */

    grunt.registerTask("pages", [
        "checkout:pages",
        "clean:pages",
        "checkout:module",
        "copy:pagespre",
        "checkout:pages",
        "copy:pagespost",
        "replace:pages",
        "push:pages",
        "checkout:module"
    ]);

    /**
     * default
     */

    grunt.registerTask("default", "module");
    grunt.registerTask("ps", "push:module");
    grunt.registerTask("p", "pages");
    grunt.registerTask("all", "module ps p");
};