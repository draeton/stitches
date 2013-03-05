module.exports = function(grunt) {

    "use strict";

    /**
     * register custom tasks
     */

    grunt.registerMultiTask("rebase", "Rebase cwd", function () {
        var dir = this.data.dir;

        grunt.file.setBase(dir);
        grunt.log.ok("Base dir is now " + process.cwd());
    });
};