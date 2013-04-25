module.exports = function(grunt) {

    "use strict";

    /**
     * register custom tasks
     */


    /**
     * git checkout
     */
    grunt.registerMultiTask("checkout", "Checkout a git branch", function () {
        var done = this.async();
        var shell = require("shelljs");
        var pkg = require("../package.json");
        var branch = this.data.branch || "master";

        shell.exec("git checkout " + branch);
    });

    /**
     * git add . && git commit -am "" && git push
     */
    var commitMessage = "";

    var setCommitMessage = function (callback) {
        var prompt = require("prompt");

        if (!commitMessage) {
            grunt.log.writeln("Please enter a commit message.");
            prompt.start();
            prompt.get(["msg"], function (err, result) {
                if (err || !result.msg) {
                    grunt.fail.fatal("This task requires a message.");
                }

                commitMessage = result.msg;
                callback && callback();
            });
        } else {
            callback && callback();
        }
    };

    grunt.registerMultiTask("push", "Commit the changes and push to github", function () {
        var done = this.async();
        var shell = require("shelljs");
        var pkg = require("../package.json");
        var branch = this.data.branch || "master";
        var messagePrefix;

        switch (branch) {
        case "gh-pages":
            messagePrefix = "Pages " + pkg.version + " - ";
            break;
        case "master":
        default:
            messagePrefix = "Build " + pkg.version + " - ";
            break;
        }

        setCommitMessage(function () {
            shell.exec("git add .");
            shell.exec("git commit -am \"" + messagePrefix + commitMessage + "\"");
            shell.exec("git push origin " + branch);

            done();
        });
    });
};