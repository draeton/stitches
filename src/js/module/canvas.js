/**
 * # module/canvas
 *
 * Constructor for the sprite sheet canvas element, which holds and displays
 * all placed sprites. Used for manipulating sprite placement and
 * state
 *
 * > http://draeton.github.io/stitches<br/>
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
        images: null, // an array holding any pre-init included images
        dimensions: {
            width: 400, // default canvas width
            height: 400 // default canvas height
        }
    };

    /**
     * ## Canvas
     * Create a new `Canvas` instance
     *
     * @constructor
     * @param {element} element
     * @param {object} options
     * @param {object} handlers The handlers for various events
     */
    var Canvas = function (element, options, handlers) {
        this.$element = $(element);
        this.settings = $.extend({}, defaults, options);
        this.images = this.settings.images;
        this.dimensions = this.settings.dimensions;

        this.sprites = [];
        this.names = [];

        this.onprogress = handlers.onprogress || util.noop;
    };

    Canvas.classname = ".stitches-canvas";

    Canvas.prototype = {
        constructor: Canvas,

        /**
         * ### @init
         * Run methods to prepare the instance for use
         */
        init: function () {
            this.reset = util.debounce(this.reset, 500);
            this.bind();
            this.setup();
            this.reset();
        },

        /**
         * ### @bind
         * Bind event handlers to DOM element. $.proxy is used to retain
         * this instance as the callback execution context
         */
        bind: function () {
            this.$element.on("clear-active", $.proxy(this.clearActive, this));
        },

        /**
         * ### @setup
         * Currently only initializes any in-document images as sprites
         * on this canvas. Removes the images after processing
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
         * ### @reset
         * Recalculate canvas dimensions and sprite positioning. Used
         * after a change to sprites or settings
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
         * ### @measure
         * Determine the canvas dimensions based on a set of sprites
         *
         * @param {array} sprites An array of sprites to measure
         */
        measure: function (sprites) {
            this.dimensions = layoutManager.getDimensions(sprites, this.settings.dimensions);
        },

        /**
         * ### @place
         * Place a set of sprites on this canvas. Sorts sprites by `name`
         * property before placement
         *
         * @param {array} sprites An array of sprites to place
         */
        place: function (sprites) {
            var placed = [];

            $.map(sprites, function (sprite) {
                sprite.reset();
            });

            sprites = sprites.sort(function (a, b) {
                return a.name === b.name ? 0 : a.name > b.name ? 1 : -1;
            });

            layoutManager.placeSprites(sprites, placed, this.dimensions, this.onprogress);
        },

        /**
         * ### @cut
         * Trim an excess canvas dimensions not required to include this
         * set of sprites
         *
         * @param {array} sprites An array of sprites to bound
         */
        cut: function (sprites) {
            layoutManager.trim(sprites, this.dimensions);

            this.$element.css({
                width: this.dimensions.width + "px",
                height: this.dimensions.height + "px"
            });
        },

        /**
         * ### @add
         * Add a sprite to this canvas. Triggers a reset and other UI updates
         *
         * @param {Sprite} sprite The sprite instance to add
         */
        add: function (sprite) {
            this.sprites.push(sprite);
            this.names.push(sprite.name);

            this.$element.trigger("show-overlay");
            sprite.$element.appendTo(this.$element);
            this.$element.trigger("update-toolbar");

            this.reset();
        },

        /**
         * ### @remove
         * Remove a sprite from this canvas. Triggers a reset and other UI
         * updates
         *
         * @param {Sprite} sprite The sprite instance to remove
         */
        remove: function (sprite) {
            this.sprites = array.remove(this.sprites, sprite);
            this.names = array.remove(this.names, sprite.name);

            this.$element.trigger("show-overlay");
            sprite.$element.fadeOut("fast").remove();
            this.$element.trigger("update-toolbar");
            this.$element.trigger("close-properties");

            this.reset();
        },

        /**
         * ### @clear
         * Clear all sprites from this canvas. Triggers a reset and other
         * UI updates
         */
        clear: function () {
            this.empty();

            this.$element.trigger("show-overlay");
            this.$element.trigger("update-toolbar");
            this.$element.trigger("close-properties");
            this.$element.trigger("open-settings");

            this.reset();
        },

        /**
         * ### @empty
         * Only empties out arrays and containers
         */
        empty: function () {
            this.sprites = [];
            this.names = [];
            this.$element.empty();
        },

        /**
         * ### @createSprite
         * Create a new sprite instance to place on this canvas.
         *
         * @param {string} name The sprite name (usually from a file name)
         * @param {string} src The image src (usually from a FileReader)
         */
        createSprite: function (name, src) {
            var self = this;
            var sprite = new Sprite({
                name: name,
                src: src,
                padding: this.settings.padding
            }, {
                onload: function (sprite) {
                    self.add(sprite);
                }
            });
        },

        /**
         * ### @clearActive
         * Clears the active class from all sprites. Used to maintain
         * only one active sprite at a time
         *
         * @param {event} e The event object
         * @param {Sprite} sprite An optional sprite to set active
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
        },

        /**
         * ### @toJSON
         * Returns object for canvas export
         */
        toJSON: function () {
            return {
                sprites: this.sprites
            };
        }
    };

    return Canvas;

});