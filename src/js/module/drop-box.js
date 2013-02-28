/**
 * # module/drop-box
 *
 * ...
 *
 * > http://draeton.github.com/stitches<br/>
 * > Copyright 2013, Matthew Cobbs<br/>
 * > Licensed under the MIT license.
 */
/*global require, define */

define([
    "jquery",
    "util/util"
],
function($, util) {

    "use strict";

    var defaults = {};

    /**
     * ## DropBox
     *
     * Create a new `DropBox` instance
     *
     * @constructor
     * @param {element} element
     * @param {object} options
     */
    var DropBox = function (element, options) {
        this.$element = $(element);
        this.$overlay = this.$element.find(".stitches-overlay");
        this.settings = $.extend({}, defaults, options);

        this.init();
    };

    DropBox.classname = ".stitches-drop-box";

    DropBox.prototype = {
        constructor: DropBox,

        /**
         * ### DropBox.prototype.init
         * ...
         */
        init: function () {
            this.proxy();
            this.bind();
        },

        /**
         * ### DropBox.prototype.proxy
         * ...
         */
        proxy: function () {
            util.proxy(this, "dragStart dragStop drop");
        },

        /**
         * ### DropBox.prototype.bind
         * ...
         */
        bind: function () {
            var dropBox = this.$element.get(0);
            var overlay = this.$overlay.get(0);

            dropBox.addEventListener("dragenter", this.dragStart, false);
            overlay.addEventListener("dragleave", this.dragStop, false);
            overlay.addEventListener("dragexit", this.dragStop, false);
            overlay.addEventListener("dragover", this.noop, false);
            overlay.addEventListener("drop", this.drop, false);
        },

        /**
         * ### DropBox.prototype.noop
         * ...
         */
        noop: function (e) {
            e.preventDefault();
            e.stopPropagation();
        },

        /**
         * ### DropBox.prototype.dragStart
         * ...
         */
        dragStart: function (e) {
            this.$element.trigger("close-palettes");
            this.$element.trigger("show-overlay");
        },

        /**
         * ### DropBox.prototype.dragStop
         * ...
         */
        dragStop: function (e) {
            if ($.contains(this.$element, e.target)) {
                this.$element.trigger("hide-overlay");
            }
        },

        /**
         * ### DropBox.prototype.drop
         * ...
         */
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