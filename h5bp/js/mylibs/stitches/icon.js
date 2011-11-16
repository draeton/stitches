/*!
 * Stitches.Icon
 * http://draeton.github.com/Stitches
 *
 * Copyright 2011, Matthew Cobbs
 * Licensed under the MIT license.
 */
/*global jQuery, Stitches */
(function (window, Stitches) {

    "use strict";

    var guid = 0;

    // Icon image class
    Stitches.Icon = function (name, src, cb) {
        var self = this;

        this.guid = guid++;
        this.name = name.replace(/\.|\s+/gi, "-");

        this.image = new Image();
        this.image.onload = function () {
            self.x = 0;
            self.y = 0;
            self.width = self.image.width;
            self.height = self.image.height;
            self.area = self.width * self.height;

            if (cb) {
                cb(self);
            }
        }
        this.image.src = src;
    };

})(window, Stitches);