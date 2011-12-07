// ## Stitches - HTML5 Sprite Generator
//
// [http://draeton.github.com/stitches](http://draeton.github.com/stitches)
//
// Copyright 2011, Matthew Cobbs
// Licensed under the MIT license.
//
/*global jQuery, Stitches, Modernizr */
(function (window, $, Modernizr) {

    "use strict";

    // ## Stitches namespace
    //
    // Holds all methods
    window.Stitches = (function () {
        // **Some configuration defaults**
        var defaults = {
            "jsdir": "js"
        };

        // **Pub/sub subscription manager**
        var topics = {};

        return {
            // ### init
            //
            // Readies everything for user interaction.
            //
            //     @param {jQuery} $elem A wrapped DOM node
            //     @param {Object} config An optional settings object
            init: function ($elem, config) {
                Stitches.settings = $.extend({}, defaults, config);
                Stitches.imageQueue = [];
                Stitches.Page.$elem = $elem;

                /* setup subscriptions */
                Stitches.sub("page.error",          Stitches.Page.errorHandler);
                Stitches.sub("page.init.done",      Stitches.Page.fetchTemplates);
                Stitches.sub("page.templates.done", Stitches.Page.render);
                Stitches.sub("page.render.done",    Stitches.checkAPIs);
                Stitches.sub("page.apis.done",      Stitches.Page.bindDragAndDrop);
                Stitches.sub("page.apis.done",      Stitches.Page.bindButtons);
                Stitches.sub("page.drop.done",      Stitches.File.handleFiles);
                Stitches.sub("sprite.generate",     Stitches.generateStitches);

                /* notify */
                Stitches.pub("page.init.done");
            },

            // ### sub
            //
            // Subscribe to a topic
            //
            //     @param {String} topic The subscription topic name
            //     @param {Function} fn A callback to fire
            sub: function (topic, fn) {
                var callbacks = topics[topic] ||  $.Callbacks("stopOnFalse");
                if (fn) {
                    callbacks.add(fn);
                }
                topics[topic] = callbacks;
            },

            // ### pub
            //
            // Publish a topic
            //
            //     @param {String} topic The subscription topic name
            pub: function (topic) {
                var callbacks = topics[topic],
                    args = Array.prototype.slice.call(arguments, 1);
                console.log('publishing: ', topic, callbacks, args)
                if (callbacks) {
                    callbacks.fire.apply(callbacks, args);
                }
            },

            // ### checkAPIs
            //
            // Load supporting libraries for browsers with no native support. Uses
            // Modernizr to check for drag-and-drop, FileReader, and canvas
            // functionality.
            checkAPIs: function () {
                Modernizr.load([
                    {
                        test: typeof FileReader !== "undefined" && Modernizr.draganddrop,
                        nope: Stitches.settings.jsdir + "/dropfile/dropfile.js"
                    },
                    {
                        test: Modernizr.canvas,
                        nope: Stitches.settings.jsdir + "/flashcanvas/flashcanvas.js",
                        complete: function () {
                            if (typeof FileReader !== "undefined" && Modernizr.draganddrop && Modernizr.canvas) {
                                Stitches.pub("page.apis.done");
                            } else {
                                Stitches.pub("page.error", new Error("Required APIs are not present."));
                            }
                        }
                    }
                ]);
            },

            // ### generateStitches
            //
            // Positions all of the icons from the $filelist on the canvas;
            // crate the sprite link and the stylesheet link;
            // updates button state
            //
            //     @param {[Icon]} looseIcons An Icon array of images to place
            generateStitches: function (looseIcons) {
                var placedIcons = Stitches.positionImages(looseIcons);
                var sprite = Stitches.makeStitches(placedIcons);
                var stylesheet = Stitches.makeStylesheet(placedIcons);

                Stitches.Page.buttons.$sprite.attr("href", sprite);
                Stitches.Page.buttons.$stylesheet.attr("href", stylesheet);

                /* notify */
                Stitches.pub("sprite.generate.done");
            },

            // ### positionImages
            //
            // Position all of the images in the `looseIcons` array within the canvas
            //
            //     @param {[Icon]} looseIcons An Icon array of images to place
            //     @return {[Icon]} The placed images array
            positionImages: function (looseIcons) {
                var placedIcons = [];

            	/* reset position of icons */
            	$(looseIcons).each(function (idx, icon) {
            		icon.x = icon.y = 0;
            		icon.isPlaced = false;
            	});

                /* reverse sort by area */
                looseIcons = looseIcons.sort(function (a, b) {
                    return b.area - a.area;
                });

                /* find the ideal sprite for this set of icons */
                Stitches.canvas = Stitches.Icons.idealCanvas(looseIcons);

                /* try to place all of the icons on the ideal canvas */
                Stitches.Icons.placeIcons(looseIcons, placedIcons, Stitches.canvas);

                /* trim empty edges */
                Stitches.Icons.cropCanvas(placedIcons, Stitches.canvas);

                /* notify  and return */
                Stitches.pub("sprite.position.done", placedIcons);
                return placedIcons;
            },

            // ### makeStitches
            //
            // Draw images on canvas
            //
            //     @param {[Icon]} The placed images array
            //     @return {String} The sprite image data URL
            makeStitches: function (placedIcons) {
                var context, data;
                
                /* this block often fails as a result of the cross-
                   domain blocking in browses for access to write
                   image data to the canvas */
                try {
                    context = Stitches.canvas.getContext('2d');
                    $(placedIcons).each(function (idx, icon) {
                        context.drawImage(icon.image, icon.x, icon.y);
                    });

                    /* create image link */
                    data = Stitches.canvas.toDataURL();
                } catch (e) {
                    Stitches.pub("page.error", e);
                }

                /* notify  and return */
                Stitches.pub("sprite.image.done", data);
                return data;
            },

            // ### makeStylesheet
            //
            // Create stylesheet text
            //
            //     @param {[Icon]} The placed images array
            //     @return {String} The sprite stylesheet
            makeStylesheet: function (placedIcons) {
                /* sort by name for css output */
                placedIcons = placedIcons.sort(function (a, b) {
                    return a.name < b.name ? -1 : 1;
                });

                var css = [
                    ".sprite {\n",
                    "    background: url(sprite.png) no-repeat;\n",
                    "}\n\n"
                ];

                $(placedIcons).each(function (idx, icon) {
                    css.concat([
                        ".sprite-" + icon.name + " {\n",
                        "    width: " + icon.width + "px;\n",
                        "    height: " + icon.height + "px;\n",
                        "    background-position: -" + icon.x + "px -" + icon.y + "px;\n",
                        "}\n\n"
                    ]);
                });

                /* create stylesheet link */
                var data = "data:," + encodeURIComponent(css.join(""));

                /* notify  and return */
                Stitches.pub("sprite.stylesheet.done", data);
                return data;
            }
        };
    })();

})(window, jQuery, Modernizr);