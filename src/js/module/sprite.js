/**
 * # module/stitches
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
    "util/util",
    "util/templates"
],
function($, util, templates) {

    "use strict";

    var defaults = {
        name: "",
        src: "",
        padding: 0,
        callback: null
    };

    /**
     * ## Sprite
     *
     * Create a new `Sprite` instance
     *
     * @constructor
     * @param {element} element
     * @param {object} options
     */
    var Sprite = function (options) {
        this.settings = $.extend({}, defaults, options);
        this.$element = null;
        this.name = util.cleanName(this.settings.name);
        this.src = this.settings.src;
        this.padding = parseInt(this.settings.padding, 10);
        this.callback = this.settings.callback;
        this.active = false;
        this.placed = false;

        this.init();
    };

    Sprite.classname = ".stitches-sprite";

    Sprite.prototype = {
        constructor: Sprite,

        /**
         * ### Sprite.prototype.init
         * ...
         */
        init: function () {
            this.load();
        },

        /**
         * ### Sprite.prototype.load
         * ...
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
                self.proxy();
                self.bind();

                if (self.callback) {
                    self.callback(self);
                }
            };

            this.image.src = this.src;
        },

        /**
         * ### Sprite.prototype.render
         * ...
         */
        render: function () {
            var html = templates.sprite(this);

            this.$element = $(html);
            this.$element.data("sprite", this);
        },

        /**
         * ### Sprite.prototype.proxy
         * ...
         */
        proxy: function () {
            util.proxy(this, "click");
        },

        /**
         * ### Sprite.prototype.bind
         * ...
         */
        bind: function () {
            this.$element.on("click", this.click);
        },

        /**
         * ### Sprite.prototype.reset
         * ...
         */
        reset: function () {
            this.x = 0;
            this.y = 0;
            this.placed = false;
            this.$element.removeClass("placed");
        },

        /**
         * ### Sprite.prototype.show
         * ...
         */
        show: function () {
            this.$element.css({
                left: this.x + "px",
                top: this.y + "px",
                padding: this.padding + "px"
            }).addClass("placed");
        },

        /**
         * ### Sprite.prototype.click
         * ...
         */
        click: function (e) {
            this.active = !this.active;

            if (this.active) {
                this.$element.trigger("clear-active", [this]);
                this.$element.trigger("open-properties", [this]);
            } else {
                this.$element.trigger("close-properties");
            }

            this.$element.toggleClass("active");
        },

        /**
         * ### Sprite.prototype.configure
         * ...
         */
        configure: function (properties) {
            if (properties.padding) {
                this.padding = parseInt(properties.padding, 10);
                this.width = this.image.width + this.padding * 2;
                this.height = this.image.height + this.padding * 2;
                this.area = this.width * this.height;
            }
        }
    };

    return Sprite;

});