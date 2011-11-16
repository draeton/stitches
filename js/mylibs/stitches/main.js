/*!
 * Stitches - HTML5 Sprite Generator
 * http://draeton.github.com/Stitches
 *
 * Copyright 2011, Matthew Cobbs
 * Licensed under the MIT license.
 */
/*global jQuery, Stitches */
(function (window) {

    "use strict";

    window.Stitches = (function () {
        return {
            init: function ($elem) {
                Stitches.filesCount = 0;
                Stitches.Page.init($elem);
            },

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

            positionImages: function () {
            	// reset position of icons
            	Stitches.looseIcons.forEach(function (icon, idx) {
            		icon.x = icon.y = 0;
            		icon.isPlaced = false;
            	});

                // reverse sort by area
                Stitches.looseIcons = Stitches.looseIcons.sort(function (a, b) {
                    return b.area - a.area;
                });

                // find the ideal sprite for this set of icons
                Stitches.canvas = Stitches.Icons.idealCanvas(Stitches.looseIcons);

                // try to place all of the icons on the ideal canvas
                Stitches.Icons.placeIcons(Stitches.looseIcons, Stitches.placedIcons, Stitches.canvas);

                // trim empty edges
                Stitches.Icons.cropCanvas(Stitches.placedIcons, Stitches.canvas);
            },

            // draw images on canvas
            makeStitches: function () {
                var context = Stitches.canvas.getContext('2d');
                Stitches.placedIcons.forEach(function (icon, idx) {
                    context.drawImage(icon.image, icon.x, icon.y);
                });

                // add save link
                return Stitches.canvas.toDataURL();
            },

            // create stylesheet text
            makeStylesheet: function () {
                // sort by name for css output
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

                // add save link
                return "data:," + encodeURIComponent(text);
            }
        };
    })();

})(window);