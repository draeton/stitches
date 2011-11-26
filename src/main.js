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
                
                var jsdir = Stitches.settings.jsdir;
                
                Modernizr.load([
                    {
                        test: typeof FileReader !== "undefined" && Modernizr.draganddrop,
                        nope: jsdir + "/dropfile/dropfile.js"
                    },
                    {
                        test: Modernizr.canvas,
                        nope: jsdir + "/flashcanvas/flashcanvas.js",
                        complete: function () {
                            Stitches.filesCount = 0;
                            Stitches.Page.init($elem);
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
            	Stitches.looseIcons.forEach(function (icon, idx) {
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
                Stitches.placedIcons.forEach(function (icon, idx) {
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

                var text = "";
                text += ".sprite {\n";
                text += "    background: url(sprite.png) no-repeat;\n";
                text += "}\n\n";

                Stitches.placedIcons.forEach(function (icon, idx) {
                    text += ".sprite-" + icon.name + " {\n";
                    text += "    width: " + icon.width + "px;\n";
                    text += "    height: " + icon.height + "px;\n";
                    text += "    background-position: -" + icon.x + "px -" + icon.y + "px;\n";
                    text += "}\n\n";
                });

                /* add save link */
                return "data:," + encodeURIComponent(text);
            }
        };
    })();

})(window, jQuery, Modernizr);