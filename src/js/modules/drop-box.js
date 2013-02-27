// ## modules/drop-box
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

    var defaults = {};

    var DropBox = function (element, options) {
        this.$element = $(element);
        this.$overlay = this.$element.find(".stitches-overlay");
        this.settings = $.extend({}, defaults, options);

        this.init();
    };

    DropBox.classname = ".stitches-drop-box";

    DropBox.prototype = {
        constructor: DropBox,

        init: function () {
            this.proxy();
            this.bind();
        },

        proxy: function () {
            util.proxy(this, "dragStart dragStop drop");
        },

        bind: function () {
            var dropBox = this.$element.get(0);
            var overlay = this.$overlay.get(0);

            dropBox.addEventListener("dragenter", this.dragStart, false);
            overlay.addEventListener("dragleave", this.dragStop, false);
            overlay.addEventListener("dragexit", this.dragStop, false);
            overlay.addEventListener("dragover", this.noop, false);
            overlay.addEventListener("drop", this.drop, false);
        },

        noop: function (e) {
            e.preventDefault();
            e.stopPropagation();
        },

        dragStart: function (e) {
            this.$element.trigger("close-palettes");
            this.$element.trigger("show-overlay");
        },

        dragStop: function (e) {
            if ($.contains(this.$element, e.target)) {
                this.$element.trigger("hide-overlay");
            }
        },

        drop: function (e) {
            var files = (e.files || e.dataTransfer.files);

            e.stopPropagation();
            e.preventDefault();

            if (files.length) {
                this.$element.trigger("process-files", [files]);
            } else {
                this.$element.trigger("hide-overlay");
            }
        }
    };

    return DropBox;

});