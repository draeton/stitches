/**
 * # module/drop-box
 *
 * Constructor for the drag and drop element. Used to allow users to drag
 * files onto a DOM element to initiate processing
 *
 * > http://draeton.github.io/stitches<br/>
 * > Copyright 2013 Matthew Cobbs<br/>
 * > Licensed under the MIT license.
 */

define([
    "wrap/jquery",
    "util/util"
],
function($, util) {

    "use strict";

    var defaults = {};

    /**
     * ## DropBox
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
         * ### @init
         * Run methods to prepare the instance for use
         */
        init: function () {
            this.bind();
        },

        /**
         * ### @bind
         * Bind event handlers to DOM element. $.proxy is used to retain
         * this instance as the callback execution context
         */
        bind: function () {
            var dropBox = this.$element.get(0);
            var overlay = this.$overlay.get(0);

            dropBox.addEventListener("dragenter", $.proxy(this.dragStart, this), false);
            overlay.addEventListener("dragleave", $.proxy(this.dragStop, this), false);
            overlay.addEventListener("dragexit", $.proxy(this.dragStop, this), false);
            overlay.addEventListener("dragover", util.noop, false);
            overlay.addEventListener("drop", $.proxy(this.drop, this), false);
        },

        /**
         * ### @dragStart
         * Close all palettes and block the UI when dragging
         *
         * @param {event} e The event object
         */
        dragStart: function (e) {
            this.$element.trigger("close-palettes");
            this.$element.trigger("show-overlay");
        },

        /**
         * ### @dragStop
         * If we're on the target, unblock the UI
         *
         * @param {event} e The event object
         */
        dragStop: function (e) {
            if ($.contains(this.$element, e.target)) {
                this.$element.trigger("hide-overlay");
            }
        },

        /**
         * ### @drop
         * When a drop event occurs, check for files. If there
         * are files, start processing them
         *
         * @param {event} e The event object
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