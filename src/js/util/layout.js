/**
 * # util/layout
 *
 * Utility methods for setting the canvas layout and stitching the sprites
 * together (i.e. placing them on the canvas)
 *
 * > http://draeton.github.com/stitches<br/>
 * > Copyright 2013, Matthew Cobbs<br/>
 * > Licensed under the MIT license.
 */
/*global require, define */

define([
    "jquery",
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
         * ### layout.set
         * Set the working layout manager instance by type
         *
         * @param {string} type The layout manager type
         */
        set: function (type) {
            var Manager = managers[type] || managers.compact;

            this.manager = new Manager();
        },

        /**
         * ### layout.getDimensions
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
         * ### layout.placeSprites
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
         * ### layout.trim
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
         * ### layout.getSpritesheet
         * Returns an image using the browser canvas element's drawing context.
         * Triggers a non-fatal error if anything fails
         *
         * @param {object} options The generator parameters
         * @option {array} sprites A list of sprites
         * @option{object} dimensions Working width and height
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
        },

        /**
         * ### layout.makeStylesheet
         * Make a stylesheet to place images with spritesheet
         *
         * @param {array} sprites A list of sprites
         * @param {string} spritesheet The data URL of the spritesheet
         * @param {string} prefix Used to create CSS classes
         * @param {boolean} uri Switch including image as data URI
         * @param {string} style Either CSS or Less
         * @return string
         */
        makeStylesheet: function (sprites, spritesheet, prefix, uri, style) {
            var backgroundImage = uri ? spritesheet : "download.png";
            var styles;
            var stylesheet;

            sprites = sprites.sort(function (a, b) {
                return a.name < b.name ? -1 : 1;
            });

            switch (style) {
            case "less":
                styles = this.makeStylesLESS(sprites, prefix, backgroundImage);
                break;
            case "css":
                styles = this.makeStylesCSS(sprites, prefix, backgroundImage);
                break;
            default:
                break;
            }

            stylesheet = "data:text/plain," + encodeURIComponent(styles.join("\n"));

            return stylesheet;
        },

        /**
         * ### layout.makeStylesCSS
         * Make a CSS styles
         *
         * @param {array} sprites A list of sprites
         * @param {string} prefix Used to create CSS classes
         * @param {string} backgroundImage Used for the main sprite class
         * @return string
         */
        makeStylesCSS: function (sprites, prefix, backgroundImage) {
            var styles = [
                "." + prefix + " {",
                "    background: url(" + backgroundImage + ") no-repeat;",
                "}\n"
            ];

            $.map(sprites, function (sprite) {
                styles = styles.concat([
                    "." + prefix + "-" + sprite.name + " {",
                    "    width: " + sprite.image.width + "px;",
                    "    height: " + sprite.image.height + "px;",
                    "    background-position: -" + sprite.left() + "px -" + sprite.top() + "px;",
                    "}\n"
                ]);
            });

            return styles;
        },

        /**
         * ### layout.makeStylesLESS
         * Make a LESS styles
         *
         * @param {array} sprites A list of sprites
         * @param {string} prefix Used to create CSS classes
         * @param {string} backgroundImage Used for the main sprite class
         * @return string
         */
        makeStylesLESS: function (sprites, prefix, backgroundImage) {
            var styles = [
                "." + prefix + " (@x: 0, @y: 0, @width: 0, @height: 0) {",
                "    background: url(" + backgroundImage + ") @x @y no-repeat;",
                "    display: block;",
                "    width: @width;",
                "    height: @height;",
                "}\n"
            ];

            $.map(sprites, function (sprite) {
                styles = styles.concat([
                    "." + prefix + "-" + sprite.name + " {",
                    " .sprite(-" + sprite.left() + "px, -" + sprite.top() + "px, " + sprite.image.width + "px, " + sprite.image.height + "px); ",
                    "}\n"
                ]);
            });

            return styles;
        }

    };

});