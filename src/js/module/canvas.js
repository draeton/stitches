/**
 * # module/canvas
 *
 * ...
 *
 * > http://draeton.github.com/stitches<br/>
 * > Copyright 2013 Matthew Cobbs<br/>
 * > Licensed under the MIT license.
 */

define([
    "wrap/jquery",
    "util/util",
    "util/array",
    "manager/layout",
    "module/sprite"
],
function($, util, array, layoutManager, Sprite) {

    "use strict";

    var defaults = {
        images: null,
        dimensions: {
            width: 400,
            height: 400
        },
        progress: function () {}
    };

    /**
     * ## Canvas
     *
     * Create a new `Canvas` instance
     *
     * @constructor
     * @param {element} element
     * @param {object} options
     */
    var Canvas = function (element, options) {
        this.$element = $(element);
        this.settings = $.extend({}, defaults, options);
        this.images = this.settings.images;
        this.dimensions = this.settings.dimensions;
        this.progress = this.settings.progress;
        this.sprites = [];
        this.names = "";
    };

    Canvas.classname = ".stitches-canvas";

    Canvas.prototype = {
        constructor: Canvas,

        /**
         * ### Canvas.prototype.init
         * ...
         */
        init: function () {
            this.reset = util.debounce(this.reset, 500);
            this.bind();
            this.setup();
            this.reset();
        },

        /**
         * ### Canvas.prototype.bind
         * ...
         */
        bind: function () {
            this.$element.on("clear-active", $.proxy(this.clearActive, this));
        },

        /**
         * ### Canvas.prototype.setup
         * ...
         */
        setup: function () {
            var self = this;

            $(this.images).each(function () {
                var $img = $(this);
                var name = $img.data("name");
                var src = $img.attr("src");

                self.createSprite(name, src);
            }).remove();
        },

        /**
         * ### Canvas.prototype.reset
         * ...
         */
        reset: function () {
            this.$element.trigger("show-overlay");
            this.measure(this.sprites);
            this.place(this.sprites);
            this.cut(this.sprites);
            this.$element.trigger("generate-sheets");
            this.$element.trigger("hide-overlay");
        },

        /**
         * ### Canvas.prototype.measure
         * ...
         */
        measure: function (sprites) {
            this.dimensions = layoutManager.getDimensions(sprites, this.settings.dimensions);
        },

        /**
         * ### Canvas.prototype.place
         * ...
         */
        place: function (sprites) {
            var placed = [];

            $.map(sprites, function (sprite) {
                sprite.reset();
            });

            sprites = sprites.sort(function (a, b) {
                if (b.area === a.area) {
                    return a.name > b.name ? 1 : -1;
                } else {
                    return b.area - a.area;
                }
            });

            layoutManager.placeSprites(sprites, placed, this.dimensions, this.progress);
        },

        /**
         * ### Canvas.prototype.cut
         * ...
         */
        cut: function (sprites) {
            layoutManager.trim(sprites, this.dimensions);

            this.$element.css({
                width: this.dimensions.width + "px",
                height: this.dimensions.height + "px"
            });
        },

        /**
         * ### Canvas.prototype.add
         * ...
         */
        add: function (sprite) {
            this.sprites.push(sprite);
            this.names = this.names + "/" + sprite.name + "/";

            this.$element.trigger("show-overlay");
            sprite.$element.appendTo(this.$element);
            this.$element.trigger("update-toolbar");

            this.reset();
        },

        /**
         * ### Canvas.prototype.remove
         * ...
         */
        remove: function (sprite) {
            this.sprites = array.remove(this.sprites, sprite);
            this.names = this.names.replace("/" + sprite.name + "/", "");

            this.$element.trigger("show-overlay");
            sprite.$element.fadeOut("fast").remove();
            this.$element.trigger("update-toolbar");
            this.$element.trigger("close-properties");

            this.reset();
        },

        /**
         * ### Canvas.prototype.clear
         * ...
         */
        clear: function () {
            this.sprites = [];
            this.names = "";

            this.$element.trigger("show-overlay");
            this.$element.empty();
            this.$element.trigger("update-toolbar");
            this.$element.trigger("close-properties");
            this.$element.trigger("open-settings");

            this.reset();
        },

        /**
         * ### Canvas.prototype.createSprite
         * ...
         */
        createSprite: function (name, src) {
            var self = this;
            var sprite = new Sprite({
                name: name,
                src: src,
                padding: this.settings.padding,
                callback: function (sprite) {
                    self.add(sprite);
                }
            });
        },

        /**
         * ### Canvas.prototype.clearActive
         * ...
         */
        clearActive: function (e, sprite) {
            this.$element.find(".active").each(function () {
                var $active = $(this);
                var active = $active.data("sprite");

                if (sprite && active !== sprite) {
                    $active.removeClass("active");
                    active.active = false;
                }
            });
        }
    };

    return Canvas;

});