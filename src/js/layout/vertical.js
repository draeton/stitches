/**
 * # layout/vertical
 *
 * Constructor for the vertical canvas layout manager
 *
 * > http://draeton.github.com/stitches<br/>
 * > Copyright 2013, Matthew Cobbs<br/>
 * > Licensed under the MIT license.
 */
/*global require, define */

define([
    "jquery",
    "util/util",
    "layout/base"
],
function ($, util, BaseLayout) {

    "use strict";

    var defaults = {
        maxPass: 2
    };

    /**
     * ## VerticalLayout
     *
     * Create a new `VerticalLayout` instance
     *
     * @constructor
     * @param {object} options
     */
    var VerticalLayout = function (options) {
        this.settings = $.extend({}, defaults, options);
    };

    util.inherit(VerticalLayout, BaseLayout, {
        /**
         * ### VerticalLayout.prototype.getDimensions
         * ...
         */
        getDimensions: function (sprites, defaults) {
            var width = 0;
            var height = 0;

            $.map(sprites, function (sprite) {
                width = sprite.width > width ? sprite.width : width;
                height += sprite.height;
            });

            return {
                width: width || defaults.width,
                height: height || defaults.height
            };
        },

        /**
         * ### VerticalLayout.prototype.getDimensions
         * ...
         */
        placeSprite: function (sprite, placed, dimensions) {
            var intersection;
            var pass = 0;
            var x = 0;
            var y = 0;

            while (pass++ < this.settings.maxPass) {
                for (y = 0; y <= dimensions.height - sprite.height; y++) {
                    sprite.x = x;
                    sprite.y = y;

                    intersection = this.intersection(sprite, placed);

                    if (!intersection) {
                        placed.push(sprite);
                        sprite.show();
                        return true;
                    }

                    y = intersection.y + intersection.height - 1;
                }

                dimensions.width += sprite.width;
                dimensions.height += sprite.height;
            }

            return false;
        }
    });

    return VerticalLayout;

});
