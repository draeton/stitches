// ## modules/file-manager
//
// [http://draeton.github.com/stitches](http://draeton.github.com/stitches)
//
// Copyright 2013, Matthew Cobbs
// Licensed under the MIT license.
//
/*global require, define */
define(["jquery", "util/util"],
function($, util) {

    "use strict";

    var defaults = {
        progress: function () {}
    };

    var FileManager = function (element, options) {
        this.$element = $(element);
        this.settings = $.extend({}, defaults, options);
        this.progress = this.settings.progress;
        this.total = 0;
        this.processed = 0;

        this.init();
    };

    FileManager.prototype = {
        constructor: FileManager,

        init: function () {},

        processFiles: function (files) {
            var self = this;

            this.total = files.length;
            this.processed = 0;

            $.map(files, function (file) {
                if (/jpeg|png|gif/.test(file.type)) {
                    self.processFile(file);
                }
            });

            this.progress(0, "info");
        },

        processFile: function (file) {
            var self = this;
            var reader;

            try {
                reader = new FileReader();
                reader.onloadend = function (e) {
                    var name = file.name;
                    var src = e.target.result;

                    self.$element.trigger("create-sprite", [name, src]);
                    self.progress(++self.processed / self.total);
                };
                reader.readAsDataURL(file);
            } catch (e) {
                this.$element.trigger("error", [e]);
            }
        }
    };

    return FileManager;

});