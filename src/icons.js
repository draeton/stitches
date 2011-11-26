// ## Stitches.Icons
//
// [http://draeton.github.com/stitches](http://draeton.github.com/stitches)
//
// Copyright 2011, Matthew Cobbs  
// Licensed under the MIT license.
//
/*global jQuery, Stitches */
(function (window, Stitches) {

    "use strict";

    var document = window.document;
    
    // ## Stitches.Icons namespace
    //
    // Holds all methods for working with icons
    Stitches.Icons = (function () {
        return {
            // ### idealCanvas
            // 
            // Find the ideal sprite canvas
            //
            //     @param {Array} icons A list of icons
            //     @return {HTMLCanvasElement}
            idealCanvas: function (icons) {
                var maxW = 0;
                var maxH = 0;
                var area = 0;

                /* find the max height & width; the area is the sum of the areas
                   of the rectangles */
                icons.forEach(function (icon, idx) {
                    maxW = icon.width > maxW ? icon.width : maxW;
                    maxH = icon.height > maxH ? icon.height : maxH;
                    area += icon.area;
                });

                /* ideal shape is a square, with sides the length of the square root of
                   the area */
                var ideal = Math.ceil(Math.sqrt(area));

                /* if there is a rectangle with a width or height greater than the square
                   root, increase the length of that side of the ideal square....
                   which I guess makes it an ideal rectangle */
                var idealW = maxW > ideal ? maxW : ideal;
                var idealH = maxH > ideal ? maxH : ideal;

                /* create the sprite canvas */
                var canvas = document.createElement("canvas");
                canvas.width = idealW;
                canvas.height = idealH;

                return canvas;
            },

            // ### placeIcons
            // 
            // Place icons within the sprite (the ideal square)
            //
            //     @param {Array} loose All loose icons
            //     @param {Array} placed All placed icons
            //     @param {HTMLCanvasElement} canvas The working canvas
            //     @return {Boolean} Have all icons been placed?
            placeIcons: function (loose, placed, canvas) {
                var i = 0;

                /* loop through all of the icons, attempting to place them within the sprite
                   without intersections */
                while (loose.length && i < 10) {
                    loose.forEach(function (icon, idx) {
                        if (!icon.isPlaced) {
                            icon.isPlaced = Stitches.Icons.placeIcon(icon, placed, canvas);
                        }
                    });

                    i++;
                }

                for (i = 0; i < loose.length; i++) {
                    if (loose[i].isPlaced) {
                        loose.splice(i);
                    }
                }

                /* done */
                return true;
            },

            // ### placeIcon
            // 
            // Place one icon on the sprite, checking for intersects with the sprite
            // dimensions and other placed icons
            //
            //     @param {Icon} icon The icon to place
            //     @param {Array} placed All placed icons
            //     @param {HTMLCanvasElement} canvas The working canvas
            //     @return {Boolean} Have this icon been placed?
            placeIcon: function (icon, placed, canvas) {
                var i = 0;

                /* two tries to place the icon... */
                while (i < 2) {
                    for (var y = 0; y <= canvas.height - icon.height; y++) {
                        for (var x = 0; x <= canvas.width - icon.width; x++) {
                            icon.x = x;
                            icon.y = y;

                            var overlap = Stitches.Icons.isOverlapped(icon, placed);
                            if (!overlap) {
                                return true;
                            }

                            x = overlap.x + overlap.width;
                        }

                        y = overlap.y + overlap.height;
                    }

                    /* no room, so add the width of the icon */
                    canvas.width += icon.width;
                    canvas.height += icon.height;
                    i++;
                }

                /* if we made it here, place was unsuccessful */
                return false;
            },

            // ### isOverlapped
            // 
            // Check if this icon overlaps any of the placed icons. If not,
            // add to the `placed` array
            //
            //     @param {Icon} icon The icon to place
            //     @param {Array} placed All placed icons
            //     @return {Null|Object} Overlap coordinates, if overlap
            isOverlapped: function (icon, placed) {
                var x1, x2, y1, y2;
                var intersect = [];
                var overlap = null;

                /* filter the checkPoints arrays based on currentIcon position */
                placed.forEach(function (p, idx) {
                    x1 = (p.x < icon.x + icon.width);
                    x2 = (p.x + p.width > icon.x);
                    y1 = (p.y < icon.y + icon.height);
                    y2 = (p.y + p.height > icon.y);

                    if (x1 && x2 && y1 && y2) {
                        intersect.push(p);
                    }
                });

                /* if there are any items left in the intersect array, there has been an overlap */
                if (intersect.length) {
                    overlap = intersect.pop();
                } else {
                    placed.push(icon);
                }

                return overlap;
            },

            // ### cropCanvas
            // 
            // Crop to content, after placing icons
            //
            //     @param {Array} placed All placed icons
            //     @param {HTMLCanvasElement} canvas The working canvas
            cropCanvas: function (placed, canvas) {
                var w = 0, h = 0;

                placed.forEach(function (icon, idx) {
                    w = w > icon.x + icon.width ? w : icon.x + icon.width;
                    h = h > icon.y + icon.height ? h : icon.y + icon.height;
                });

                canvas.width = w;
                canvas.height = h;
            }
        };
    })();

})(window, Stitches);