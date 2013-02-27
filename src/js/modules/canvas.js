// ## modules/canvas
//
// [http://draeton.github.com/stitches](http://draeton.github.com/stitches)
//
// Copyright 2013, Matthew Cobbs
// Licensed under the MIT license.
//
/*global require, define */
define(["wrap/jquery", "util/util", "util/array", "util/stitches", "modules/sprite"],
function($, util, array, stitches, Sprite) {

    "use strict";

    var defaults = {
        dimensions: {
            width: 400,
            height: 400
        },
        progress: function () {}
    };

    var Canvas = function (element, options) {
        this.$element = $(element);
        this.settings = $.extend({}, defaults, options);
        this.dimensions = this.settings.dimensions;
        this.progress = this.settings.progress;
        this.sprites = [];
        this.spritesheet = null;
        this.stylesheet = null;

        this.init();
    };

    Canvas.classname = ".stitches-canvas";

    Canvas.prototype = {
        constructor: Canvas,

        init: function () {
            this.reset = util.debounce(this.reset, 500);
            this.proxy();
            this.bind();
            this.setup();
            this.reset();
        },

        proxy: function () {
            util.proxy(this, "createSprite clearActive");
        },

        bind: function () {
            this.$element.on("create-sprite", this.createSprite);
            this.$element.on("clear-active", this.clearActive);
        },

        setup: function () {
            var self = this;

            this.$element.find(".stitches-sprite").each(function () {
                var $sprite = $(this);
                var $img = $(this).find("img");
                var name = $img.data("name");
                var src = $img.attr("src");

                self.$element.trigger("create-sprite", [name, src]);
            }).remove();
        },

        reset: function () {
            this.$element.trigger("show-overlay");
            this.measure(this.sprites);
            this.place(this.sprites);
            this.cut(this.sprites);
            this.$element.trigger("hide-overlay");
        },

        measure: function (sprites) {
            this.dimensions = stitches.getDimensions(sprites, this.settings.dimensions);
        },

        place: function (sprites) {
            var placed = [];

            $.map(sprites, function (sprite) {
                sprite.reset();
            });

            sprites = sprites.sort(function (a, b) {
                if (b.area === a.area) {
                    return b.name > a.name ? 1 : -1;
                } else {
                    return b.area - a.area;
                }
            });

            stitches.placeSprites(sprites, placed, this.dimensions, this.progress);
        },

        cut: function (sprites) {
            stitches.trim(sprites, this.dimensions);

            this.$element.css({
                width: this.dimensions.width + "px",
                height: this.dimensions.height + "px"
            });
        },

        add: function (sprite) {
            this.$element.trigger("show-overlay");
            this.sprites.push(sprite);
            sprite.$element.appendTo(this.$element);
            this.$element.trigger("update-toolbar");

            this.reset();
        },

        remove: function (sprite) {
            this.$element.trigger("show-overlay");
            this.sprites = array.remove(this.sprites, sprite);
            sprite.$element.fadeOut("fast").remove();
            this.$element.trigger("update-toolbar");
            this.$element.trigger("close-properties");

            this.reset();
        },

        clear: function () {
            this.$element.trigger("show-overlay");
            this.sprites = [];
            this.$element.empty();
            this.$element.trigger("update-toolbar");
            this.$element.trigger("close-properties");
            this.$element.trigger("open-settings");

            this.reset();
        },

        generateSheets: function (settings) {
            var sprites = this.sprites;
            var dimensions = this.dimensions;
            var prefix = settings.prefix;
            var uri = settings.uri;
            var spritesheet;
            var stylesheet;

            spritesheet = stitches.makeSpritesheet(sprites, dimensions);
            stylesheet = stitches.makeStylesheet(sprites, spritesheet, prefix, uri);

            try {
                spritesheet = stitches.dataToObjectURL(spritesheet);
                stylesheet = stitches.dataToObjectURL(stylesheet);
            } catch (e) {
                this.$element.trigger("error", [e]);
            }

            this.spritesheet = spritesheet;
            this.stylesheet = stylesheet;

            this.$element.trigger("update-toolbar");
            this.progress(1, "success");
        },

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

        createSprite: function (e, name, src) {
            var self = this;

            new Sprite({
                name: name,
                src: src,
                padding: this.settings.padding,
                callback: function (sprite) {
                    self.add(sprite);
                }
            });
        }
    };

    return Canvas;

});