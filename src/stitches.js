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
            // Uses Modernizr to check for drag-and-drop, FileReader, and canvas
            // functionality. Initializes the stitches element and readies everything for
            // user interaction.
            //
            //     @param {jQuery} $elem A wrapped DOM node
            //     @param {Object} config An optional settings object
            init: function ($elem, config) {
                Stitches.settings = $.extend({}, defaults, config);
                Stitches.filesCount = 0;
                Stitches.Page.$elem = $elem;
                
                /* setup subscriptions */
                Stitches.sub("page.init", Stitches.Page.getTemplates);
                Stitches.sub("page.render", Stitches.Page.render);
                Stitches.sub("page.error", Stitches.Page.error);
                
                /* if html5 api support is missing, try to load it */
                if (typeof FileReader === "undefined" || Modernizr.draganddrop) {
                    Stitches.loadSupport();
                } else {
                    Stitches.pub("page.init");
                }
            },
            
            // ### sub
            //
            // Subscribe to a topic
            //
            //     @param {String} topic The subscription topic name
            //     @param {Function} fn A callback to fire
            sub: function (topic, fn) {
                topics[topic] = topics[topic] ||  $.Callbacks("stopOnFalse");
                topics[topic].add(fn);
            },
            
            // ### pub
            //
            // Publish a topic
            //
            //     @param {String} topic The subscription topic name
            pub: function (topic) {
                var callbacks, args;
                if (topics[topic]) {
                    callbacks = topics[topic];
                    args = Array.prototype.slice.call(arguments, 1);
                    callbacks.fire.apply(callbacks, args);
                }
            },
            
            // ### loadSupport
            //
            // Load supporting libraries for browsers with no native support
            loadSupport: function () {
                Modernizr.load([
                    {
                        test: typeof FileReader !== "undefined" && Modernizr.draganddrop,
                        nope: Stitches.settings.jsdir + "/dropfile/dropfile.js"
                    },
                    {
                        test: Modernizr.canvas,
                        nope: Stitches.settings.jsdir + "/flashcanvas/flashcanvas.js",
                        complete: function () {
                            Stitches.pub("page.init");
                        }
                    }
                ]);
            },

            // ### generateStitches
            //
            // Positions all of the icons from the $filelist on the canvas;
            // crate the sprite link and the stylesheet link;
            // updates button state
            generateStitches: function () {
            	Stitches.looseIcons = [];
            	Stitches.placedIcons = [];

            	Stitches.Page.$filelist.find("li").each(function () {
            		var icon = $(this).data("icon");
            		Stitches.looseIcons.push(icon);
            	});

                Stitches.positionImages();
                var sprite = Stitches.makeStitches();
                var stylesheet = Stitches.makeStylesheet();

                Stitches.Page.buttons.$sprite.attr("href", sprite);
                Stitches.Page.buttons.$stylesheet.attr("href", stylesheet);
                Stitches.Page.setButtonDisabled(false, ["sprite", "stylesheet"]);
            },

            // ### positionImages
            //
            // Position all of the images in the `looseIcons` array within the canvas
            positionImages: function () {
            	/* reset position of icons */
            	$(Stitches.looseIcons).each(function (idx, icon) {
            		icon.x = icon.y = 0;
            		icon.isPlaced = false;
            	});

                /* reverse sort by area */
                Stitches.looseIcons = Stitches.looseIcons.sort(function (a, b) {
                    return b.area - a.area;
                });

                /* find the ideal sprite for this set of icons */
                Stitches.canvas = Stitches.Icons.idealCanvas(Stitches.looseIcons);

                /* try to place all of the icons on the ideal canvas */
                Stitches.Icons.placeIcons(Stitches.looseIcons, Stitches.placedIcons, Stitches.canvas);

                /* trim empty edges */
                Stitches.Icons.cropCanvas(Stitches.placedIcons, Stitches.canvas);
            },

            // ### makeStitches
            // 
            // Draw images on canvas
            makeStitches: function () {
                var context = Stitches.canvas.getContext('2d');
                $(Stitches.placedIcons).each(function (idx, icon) {
                    context.drawImage(icon.image, icon.x, icon.y);
                });

                /* add save link */
                return Stitches.canvas.toDataURL();
            },

            // ### makeStylesheet
            // 
            // Create stylesheet text
            makeStylesheet: function () {
                /* sort by name for css output */
                Stitches.placedIcons = Stitches.placedIcons.sort(function (a, b) {
                    return a.name < b.name ? -1 : 1;
                });

                var css = [
                    ".sprite {\n",
                    "    background: url(sprite.png) no-repeat;\n",
                    "}\n\n"
                ];

                $(Stitches.placedIcons).each(function (idx, icon) {
                    css.push( Stitches.Page.templates.style(icon) );
                });

                /* add save link */
                return "data:," + encodeURIComponent(css.join(""));
            }
        };
    })();

})(window, jQuery, Modernizr);