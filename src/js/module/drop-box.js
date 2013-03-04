/**
 * # module/drop-box
 *
 * ...
 *
 * > http://draeton.github.com/stitches<br/>
 * > Copyright 2013, Matthew Cobbs<br/>
 * > Licensed under the MIT license.
 */

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
            this.bind();
        },

        /**
         * ### DropBox.prototype.bind
         * ...
         */
        bind: function () {
            var dropBox = this.$element.get(0);
            var overlay = this.$overlay.get(0);

            dropBox.addEventListener("dragenter", $.proxy(this.dragStart, this), false);
            overlay.addEventListener("dragleave", $.proxy(this.dragStop, this), false);
            overlay.addEventListener("dragexit", $.proxy(this.dragStop, this), false);
            overlay.addEventListener("dragover", this.noop, false);
            overlay.addEventListener("drop", $.proxy(this.drop, this), false);
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