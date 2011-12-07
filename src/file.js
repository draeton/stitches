// ## Stitches.File
//
// [http://draeton.github.com/stitches](http://draeton.github.com/stitches)
//
// Copyright 2011, Matthew Cobbs
// Licensed under the MIT license.
//
/*global jQuery, Stitches */
(function (window, Stitches, $) {

    "use strict";

    // ## Stitches.Fle namespace
    //
    // Holds all Fle procesing methods
    Stitches.File = (function () {
        
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
                        Stitches.pub("file.queue.done", file);
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
                            var icon = new Stitches.Icon(file.name, e.target.result);
                            Stitches.iconQueue.push(icon);
                            
                            /* notify */
                            Stitches.pub("file.icon.done", icon);
                        };
                        reader.readAsDataURL(file);
                    } catch (e) {
                        Stitches.pub("page.error", e);                        
                    }
                }                
            },

            // ### unqueueIcon
            //
            // Removes an icon from the queue
            //
            //     @param {Icon} removeIcon
            unqueueIcon: function (removeIcon) {
                /* remove the icon from the queue */
                Stitches.iconQueue = $.grep(Stitches.iconQueue, function (icon) {
                    return icon !== removeIcon;
                });
                
                /* notify */
                Stitches.pub("file.remove.done", removeIcon);
            },

            // ### unqueueAllIcons
            //
            // Clear all icons from the queue
            unqueueAllIcons: function () {
                $.each(Stitches.iconQueue, function (i, icon) {
                    Stitches.File.unqueueIcon(icon);
                });
            }
        };
    })();

})(window, Stitches, jQuery);