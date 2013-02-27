// ## layouts/compact
//
// [http://draeton.github.com/stitches](http://draeton.github.com/stitches)
//
// Copyright 2013, Matthew Cobbs
// Licensed under the MIT license.
//
/*global require, define */
define(["wrap/jquery", "util/util", "layouts/base"],
function ($, util, BaseLayout) {

    "use strict";

    var CompactLayout = function () {};

    util.inherit(CompactLayout, BaseLayout, {
        getDimensions: function (sprites, defaults) {
            var width = 0;
            var height = 0;
            var area = 0;
            var mean = 0;

            $.map(sprites, function (sprite) {
                width = sprite.width > width ? sprite.width : width;
                height = sprite.height > height ? sprite.height : height;
                area += sprite.area;
            })

            mean = Math.ceil(Math.sqrt(area));
            width = width > mean ? width : mean;
            height = height > mean ? height : mean;

            return {
                width: width || defaults.width,
                height: height || defaults.height
            };
        },

        placeSprite: function (sprite, placed, dimensions) {
            var intersection;
            var tries = 0;
            var x;
            var y;

            while (tries < 2) {
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
                tries++;
            }

            return false;
        }
    });

    return CompactLayout;

});
