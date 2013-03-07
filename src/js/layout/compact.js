/**
 * # layout/compact
 *
 * Constructor for the compact canvas layout manager
 *
 * > http://draeton.github.com/stitches<br/>
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
        maxPass: 2
    };

    /**
     * ## CompactLayout
     *
     * Create a new `CompactLayout` instance
     *
     * @constructor
     * @param {object} options
     */
    var CompactLayout = function (options) {
        this.settings = $.extend({}, defaults, options);
    };

    util.inherit(CompactLayout, BaseLayout, {
        /**
         * ### CompactLayout.prototype.getDimensions
         * ...
         */
        getDimensions: function (sprites, defaults) {
            var width = 0;
            var height = 0;
            var area = 0;
            var mean = 0;

            $.map(sprites, function (sprite) {
                width = sprite.width > width ? sprite.width : width;
                height = sprite.height > height ? sprite.height : height;
                area += sprite.area;
            });

            mean = Math.ceil(Math.sqrt(area));
            width = width > mean ? width : mean;
            height = height > mean ? height : mean;

            return {
                width: width || defaults.width,
                height: height || defaults.height
            };
        },

        /**
         * ### CompactLayout.prototype.placeSprite
         * ...
         */
        placeSprite: function (sprite, placed, dimensions) {
            var intersection;
            var pass = 0;
            var x = 0;
            var y = 0;

            while (pass++ < this.settings.maxPass) {
                for (y = 0; y <= dimensions.height - sprite.height; y++) {
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

                    y = intersection.y + intersection.height - 1;
                }

                dimensions.width += sprite.width;
                dimensions.height += sprite.height;
            }
        }
    });

    return CompactLayout;

});
