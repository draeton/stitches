/**
 * # manager/layout
 *
 * Methods for setting the canvas layout and stitching the sprites together
 * (i.e. placing them on the canvas)
 *
 * > http://draeton.github.io/stitches<br/>
 * > Copyright 2013 Matthew Cobbs<br/>
 * > Licensed under the MIT license.
 */

define([
    "wrap/jquery",
    "layout/compact",
    "layout/vertical",
    "layout/horizontal"
],
function ($, CompactLayout, VerticalLayout, HorizontalLayout) {

    "use strict";

    // **Canvas layout managers**
    var managers = {
        compact: CompactLayout,
        vertical: VerticalLayout,
        horizontal: HorizontalLayout
    };

    // **Module definition**
    return {
        /**
         * ### @set
         * Set the working layout manager instance by type
         *
         * @param {string} type The layout manager type
         */
        set: function (type) {
            var Manager = managers[type] || managers.compact;

            this.manager = new Manager();
        },

        /**
         * ### @getDimensions
         * Get the dimensions necessary to place the sprites
         *
         * @param {array} sprites A list of sprites to place
         * @param {object} defaults Default dimensions if no sprites
         * @return object
         */
        getDimensions: function (sprites, defaults) {
            return this.manager.getDimensions(sprites, defaults);
        },

        /**
         * ### @placeSprites
         * Position a list of sprites to fit in dimensions and layout
         *
         * @param {array} sprites To place
         * @param {array} placed Already placed
         * @param {object} dimensions Working width and height
         * @param {function} progress Function to update display on progress
         */
        placeSprites: function (sprites, placed, dimensions, progress) {
            var self = this;

            progress(0, "info");

            $.map(sprites, function (sprite) {
                if (!sprite.placed) {
                    sprite.placed = self.manager.placeSprite(sprite, placed, dimensions);
                }

                progress(placed.length / sprites.length);
            });

            sprites = $.map(sprites, function (sprite) {
                return sprite.placed ? null : sprite;
            });
        },

        /**
         * ### @trim
         * Trim dimensions to only contain placed sprites
         *
         * @param {array} sprites A list of sprites
         * @param {object} dimensions Working width and height
         */
        trim: function (sprites, dimensions) {
            var w = 0;
            var h = 0;

            $.map(sprites, function (sprite) {
                w = w > sprite.x + sprite.width ? w : sprite.x + sprite.width;
                h = h > sprite.y + sprite.height ? h : sprite.y + sprite.height;
            });

            dimensions.width = w || dimensions.width;
            dimensions.height = h || dimensions.height;
        },

        /**
         * ### @getSpritesheet
         * Returns an image using the browser canvas element's drawing context.
         * Triggers a non-fatal error if anything fails
         *
         * @param {array} options.sprites A list of sprites
         * @param{object} options.dimensions Working width and height
         * @return string
         */
        getSpritesheet: function (options) {
            var sprites = options.sprites;
            var dimensions = options.dimensions;
            var canvas;
            var context;
            var spritesheet;

            canvas = document.createElement("canvas");
            canvas.width = dimensions.width;
            canvas.height = dimensions.height;

            try {
                context = canvas.getContext("2d");

                $.map(sprites, function (sprite) {
                    var x = sprite.left();
                    var y = sprite.top();

                    context.drawImage(sprite.image, x, y);
                });

                spritesheet = canvas.toDataURL("image/png");
            } catch (e) {
                this.$element.trigger("error", [e]);
            }

            return spritesheet;
        }
    };

});