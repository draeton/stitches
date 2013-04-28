/**
 * # layout/base
 *
 * Base constructor for the canvas layout managers. Used to determine
 * canvas dimensions and to place sprites without intersections (overlap)
 *
 * > http://draeton.github.io/stitches<br/>
 * > Copyright 2013 Matthew Cobbs<br/>
 * > Licensed under the MIT license.
 */

define([
    "wrap/jquery"
],
function ($) {

    "use strict";

    var defaults = {
        maxPass: 2 // number of tries to place sprite
    };

    /**
     * ## BaseLayout
     * Create a new `BaseLayout` instance
     *
     * @constructor
     * @param {object} options
     */
    var BaseLayout = function (options) {
        this.settings = $.extend({}, defaults, options);
    };

    // **Prototype**
    BaseLayout.prototype = {
        constructor: BaseLayout,

        /**
         * ### @getDimensions
         * Returns an object with the width and height necessary
         * to contain the `sprites`
         *
         * @param {array} sprites The list of sprites to size for
         * @param {object} defaults Default width and height, if no sprites
         * @return object
         */
        getDimensions: function (sprites, defaults) {},

        /**
         * ### @placeSprite
         * Determine sprite coordinates on the canvas. Once a position is
         * determined with no intersections, the sprite is added to the
         * placed array. If there is no space, the dimensions are updated.
         *
         * @param {Sprite} sprite The sprite to place
         * @param {array} placed An array of sprites already placed
         * @param {object} dimensions The current canvas dimensions
         */
        placeSprite: function (sprite, placed, dimensions) {},

        /**
         * ### @intersection
         * Determine if a sprite intersects any other placed sprites. If no,
         * returns undefined; if yes, returns the intersecting sprite
         * for comparison
         *
         * @param {Sprite} sprite The sprite to compare against others
         * @param {array} obstacles An array of sprites already placed
         * @return undefined|Sprite
         */
        intersection: function (sprite, obstacles) {
            var x1, x2, y1, y2;
            var intersections = [];
            var intersection;

            $.map(obstacles, function (obstacle) {
                x1 = (obstacle.x < (sprite.x + sprite.width));
                y1 = (obstacle.y < (sprite.y + sprite.height));
                x2 = ((obstacle.x + obstacle.width) > sprite.x);
                y2 = ((obstacle.y + obstacle.height) > sprite.y);

                if (x1 && x2 && y1 && y2) {
                    intersections.push(obstacle);
                }
            });

            if (intersections.length) {
                intersection = intersections.pop();
            }

            return intersection;
        }
    };

    return BaseLayout;

});