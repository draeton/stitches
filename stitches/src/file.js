// ## Stitches.File
//
// [http://draeton.github.com/stitches](http://draeton.github.com/stitches)
//
// Copyright 2013, Matthew Cobbs
// Licensed under the MIT license.
//
/*global jQuery, Stitches */
(function (window, Stitches, $) {

    "use strict";

    // ## Stitches.File namespace
    //
    // Holds all File procesing methods
    Stitches.File = (function () {

        /* shortcut */
        var S = window.Stitches;

        /* track files to read */
        var readQueue = [];

        return {
            // ### queueFiles
            //
            // Loops through `files`; adds an image to the `readQueue`
            //
            //     @param {FileList} files From a drop event
            queueFiles: function (files) {
                $.each(files, function (i, file) {
                    if (/jpeg|png|gif/.test(file.type)) {
                        readQueue.push(file);
                        S.pub("file.queue.done", file);
                    }
                });
            },

            // ### queueIcons
            //
            // Read in a file from the `readQueue`. Starts up a new `FileReader`
            // to read in the image as data and create a new `Icon`
            queueIcons: function () {
                var file, reader;

                file = readQueue.shift();
                if (file) {
                    try {
                        reader = new FileReader();
                        reader.onloadend = function (e) {
                            /* create an icon and add to the icon queue */
                            var icon = new S.Icon(file.name, e.target.result);
                            S.iconQueue.push(icon);

                            /* notify */
                            S.pub("file.icon.done", icon);
                        };
                        reader.readAsDataURL(file);
                    } catch (e) {
                        S.pub("page.error", e);
                    }
                }
            },

            // ### unqueueIcon
            //
            // Removes an icon from the queue
            //
            //     @param {Icon} icon
            unqueueIcon: function (icon) {
                /* remove the icon from the queue */
                S.iconQueue = $.grep(S.iconQueue, function (item) {
                    return item !== icon;
                });
                S.Icon.clearNameCache(icon.name);

                /* notify */
                S.pub("file.remove.done", icon);
            },

            // ### unqueueAllIcons
            //
            // Clear all icons from the queue
            unqueueAllIcons: function () {
                $.each(S.iconQueue, function (i, icon) {
                    S.File.unqueueIcon(icon);
                });
                S.Icon.clearNameCache();
            }
        };
    })();

})(window, Stitches, jQuery);