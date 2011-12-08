// ## Stitches.Icon
//
// [http://draeton.github.com/stitches](http://draeton.github.com/stitches)
//
// Copyright 2011, Matthew Cobbs
// Licensed under the MIT license.
//
/*global jQuery, Stitches */
(function (window, Stitches) {

    "use strict";

    // **Maintain a unique id for each icon**
    var guid = 0;

    // ## Stitches.Icon class
    //
    // Wraps a single icon. Creates a new image from the source
    // and sets additional properties after the image loads.
    // The callback is generally used to handle queueuing
    //
    //     @param {String} name
    //     @param {String} src
    //     @param {Function} cb Optional callback
    Stitches.Icon = function (name, src, cb) {
        var self = this;

        this.guid = guid++;
        this.name = name.replace(/[\s.]+/gi, "-").replace(/[^a-z0-9\-]/gi, "_");

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