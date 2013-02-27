// ## layouts/vertical
//
// [http://draeton.github.com/stitches](http://draeton.github.com/stitches)
//
// Copyright 2013, Matthew Cobbs
// Licensed under the MIT license.
//
/*global require, define */
define(["jquery", "util/util", "layouts/base"],
function ($, util, BaseLayout) {

    "use strict";

    var VerticalLayout = function () {};

    util.inherit(VerticalLayout, BaseLayout, {
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

        placeSprite: function (sprite, placed, dimensions) {
            var intersection;
            var tries = 0;
            var x = 0;
            var y;

            while (tries < 2) {
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
                tries++;
            }

            return false;
        }
    });

    return VerticalLayout;

});
