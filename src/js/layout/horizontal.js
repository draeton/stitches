/**
 * # layout/horizontal
 *
 * Constructor for the horizontal canvas layout manager. Used to determine
 * canvas dimensions and to place sprites without intersections (overlap).
 * Places sprites in a horizontal row
 *
 * > http://draeton.github.io/stitches<br/>
 * > Copyright 2013 Matthew Cobbs<br/>
 * > Licensed under the MIT license.
 */

define([
    "wrap/jquery",
    "util/util",
    "layout/base"
],
function ($, util, BaseLayout) {

    "use strict";

    var defaults = {
        maxPass: 2 // number of tries to place sprite
    };

    /**
     * ## HorizontalLayout
     * Create a new `HorizontalLayout` instance
     *
     * @constructor
     * @param {object} options
     */
    var HorizontalLayout = function (options) {
        this.settings = $.extend({}, defaults, options);
    };

    util.inherit(HorizontalLayout, BaseLayout, {
        /**
         * ### @getDimensions
         * Returns an object with the width and height necessary
         * to contain the `sprites`. Calculation based on adding all of
         * the spirte widths.
         *
         * @param {array} sprites The list of sprites to size for
         * @param {object} defaults Default width and height, if no sprites
         * @return object
         */
        getDimensions: function (sprites, defaults) {
            var width = 0;
            var height = 0;

            $.map(sprites, function (sprite) {
                height = sprite.height > height ? sprite.height : height;
                width += sprite.width;
            });

            return {
                width: width || defaults.width,
                height: height || defaults.height
            };
        },

        /**
         * ### @placeSprite
         * Determine sprite coordinates on the canvas. Once a position is
         * determined with no intersections, the sprite is added to the
         * placed array. If there is no space, the dimensions are updated.
         * Seeks across to place the sprite.
         *
         * @param {Sprite} sprite The sprite to place
         * @param {array} placed An array of sprites already placed
         * @param {object} dimensions The current canvas dimensions
         */
        placeSprite: function (sprite, placed, dimensions) {
            var intersection;
            var pass = 0;
            var x = 0;
            var y = 0;

            while (pass++ < this.settings.maxPass) {
                for (x = 0; x <= dimensions.width - sprite.width; x++) {
                    sprite.x = x;
                    sprite.y = y;

                    intersection = this.intersection(sprite, placed);

                    if (!intersection) {
                        placed.push(sprite);
                        sprite.show();
                        return true;
                    }

                    x = intersection.x + intersection.width - 1;
                }

                dimensions.width += sprite.width;
                dimensions.height += sprite.height;
            }

            return false;
        }
    });

    return HorizontalLayout;

});
