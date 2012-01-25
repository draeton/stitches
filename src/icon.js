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

    // **Maintains a unique name for each icon**
    var nameCache = {};

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
        this.name = Stitches.Icon.getName(name);

        this.image = new Image();
        this.image.onload = function () {
            self.x = 0;
            self.y = 0;
            self.width = self.image.width + Stitches.settings.padding;
            self.height = self.image.height + Stitches.settings.padding;
            self.area = self.width * self.height;

            if (cb) {
                cb(self);
            }
        }
        this.image.src = src;
    };

    // ### Stitches.Icon.getName
    //
    // Return a unique name. If the name is already in the nameCache,
    // append a value until a unique name is found.
    //
    //     @param {String} name
    //     @return {String}
    Stitches.Icon.getName = function (name) {
        var i = 1, fix;

        name = name.replace(/[\s.]+/gi, "-").replace(/[^a-z0-9\-]/gi, "_");

        if (nameCache[name]) {
            do {
                fix = name + "-" + i++;
            } while (nameCache[fix]);
            name = fix;
        }

        nameCache[name] = true;
        return name;
    };

    // ### Stitches.Icon.clearNameCache
    //
    // Clear the name cache. If a name is passed in, only clear that key
    //
    //     @param {String} name
    //     @return {String}
    Stitches.Icon.clearNameCache = function (name) {
        if (name) {
            delete nameCache[name];
        } else {
            nameCache = {};
        }
    };

})(window, Stitches);