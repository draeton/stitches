/**
 * # module/sprite
 *
 * Constructor for the sprite element, which holds sprite dimensions,
 * position, and display info. Used for manipulation of a single
 * sprite on the canvas
 *
 * > http://draeton.github.com/stitches<br/>
 * > Copyright 2013 Matthew Cobbs<br/>
 * > Licensed under the MIT license.
 */

define([
    "wrap/jquery",
    "util/util",
    "util/templates"
],
function($, util, templates) {

    "use strict";

    var defaults = {
        name: "", // no special chars, no spaces
        src: "", // image src (usually from a FileReader)
        padding: 0 // defined in stitches settings
    };

    /**
     * ## Sprite
     * Create a new `Sprite` instance
     *
     * @constructor
     * @param {element} element
     * @param {object} options
     * @param {object} handlers The handlers for various events
     */
    var Sprite = function (options, handlers) {
        this.settings = $.extend({}, defaults, options);
        this.$element = null;
        this.name = this.cleanName(this.settings.name);
        this.src = this.settings.src;
        this.padding = parseInt(this.settings.padding, 10);
        this.active = false;
        this.placed = false;

        this.onload = handlers.onload || util.noop;

        this.init();
    };

    Sprite.classname = ".stitches-sprite";

    Sprite.prototype = {
        constructor: Sprite,

        /**
         * ### @init
         * Run methods to prepare the instance for use
         */
        init: function () {
            this.load();
        },

        /**
         * ### @load
         * Load the image data from the source, then call onload callback
         */
        load: function () {
            var self = this;

            this.image = new Image();
            this.image.onload = function () {
                self.x = 0;
                self.y = 0;
                self.width = self.image.width + self.padding * 2;
                self.height = self.image.height + self.padding * 2;
                self.area = self.width * self.height;
                self.render();
                self.bind();
                self.onload(self);
            };

            this.image.src = this.src;
        },

        /**
         * ### @render
         * Render the sprite html from a JS template and add to DOM
         */
        render: function () {
            var html = templates.sprite(this);

            this.$element = $(html);
            this.$element.data("sprite", this);
        },

        /**
         * ### @bind
         * Bind event handlers to DOM element. $.proxy is used to retain
         * this instance as the callback execution context
         */
        bind: function () {
            this.$element.on("click", $.proxy(this.click, this));
        },

        /**
         * ### @reset
         * Reset the placement status and position of the sprite. Used
         * before recalculating everything in a canvas reset
         */
        reset: function () {
            this.x = 0;
            this.y = 0;
            this.placed = false;
            this.$element.removeClass("placed");
        },

        /**
         * ### @show
         * Position and show the sprite
         */
        show: function () {
            this.$element.css({
                left: this.x + "px",
                top: this.y + "px",
                padding: this.padding + "px"
            }).addClass("placed");
        },

        /**
         * ### @click
         * Clicks trigger the sprite properties palette and toggle
         * the sprite active state
         *
         * @param {event} e The event object
         */
        click: function (e) {
            var active = !this.active;

            if (active) {
                this.$element.trigger("clear-active", [this]);
                this.$element.trigger("open-properties", [this]);
            } else {
                this.$element.trigger("close-properties");
            }

            this.active = active;
            this.$element.toggleClass("active", active);
        },

        /**
         * ### @configure
         * Updates the sprite dimensions and related data. Triggered when
         * settings (particulary padding) change
         *
         * @param {object} properties The set of values to update
         */
        configure: function (properties) {
            if (properties.padding) {
                this.padding = parseInt(properties.padding, 10);
                this.width = this.image.width + this.padding * 2;
                this.height = this.image.height + this.padding * 2;
                this.area = this.width * this.height;
            }
        },

        /**
         * ### @cleanName
         * Remove special characters and other markers from a string
         * to be used as a sprite name
         *
         * @param {string} name The name of the sprite
         * @return string
         */
        cleanName: function (name) {
            name = name.replace(/\.\w+$/i, ""); // file extension
            name = name.replace(/[\s.]+/gi, "-"); // spaces to -
            name = name.replace(/[^a-z0-9\-]/gi, "_"); // other to _

            return name;
        },

        /**
         * ### @left
         * Returns the x position of the sprite accounting for padding
         *
         * @return number
         */
        left: function () {
            return this.x + this.padding;
        },

        /**
         * ### @top
         * Returns the y position of the sprite accounting for padding
         *
         * @return number
         */
        top: function () {
            return this.y + this.padding;
        }
    };

    return Sprite;

});