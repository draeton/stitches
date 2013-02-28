/**
 * # util/stitches
 *
 * Utility methods for setting the canvas layout
 * and stitching the sprites together (i.e. placing them
 * on the canvas)
 *
 * > http://draeton.github.com/stitches<br/>
 * > Copyright 2013, Matthew Cobbs<br/>
 * > Licensed under the MIT license.
 */
/*global require, define */

define([
    "jquery",
    "layout/compact",
    "layout/vertical",
    "layout/horizontal"
],
function ($, CompactLayout, VerticalLayout, HorizontalLayout) {

    "use strict";

    // Canvas layout constructors
    var layouts = {
        compact: CompactLayout,
        vertical: VerticalLayout,
        horizontal: HorizontalLayout
    };

    // Module definition
    return {
        /**
         * ### stitches.setLayout
         * Set the working layout manager instance by type
         *
         * @param {string} type The layout manager type
         */
        setLayout: function (type) {
            var Constructor = layouts[type] || layouts.compact;

            this.layout = new Constructor();
        },

        /**
         * ### stitches.getDimensions
         * Get the dimensions necessary to place the sprites
         *
         * @param {array} sprites A list of sprites to place
         * @param {object} defaults Default dimensions if no sprites
         * @return object
         */
        getDimensions: function (sprites, defaults) {
            return this.layout.getDimensions(sprites, defaults);
        },

        /**
         * ### stitches.placeSprites
         * Position a list of sprites to fit in dimensions and layout
         *
         * @param {array} sprites To place
         * @param {array} placed Already placed
         * @param {object} dimensions Working width and height
         * @param {function} progress Function to update display on progress
         */
        placeSprites: function (sprites, placed, dimensions, progress) {
            var self = this;

            progress(0, "info");

            $.map(sprites, function (sprite) {
                if (!sprite.placed) {
                    sprite.placed = self.layout.placeSprite(sprite, placed, dimensions);
                }

                progress(placed.length / sprites.length);
            });

            sprites = $.map(sprites, function (sprite) {
                return sprite.placed ? null : sprite;
            });
        },

        /**
         * ### stitches.trim
         * Trim dimensions to only contain placed sprites
         *
         * @param {array} sprites A list of sprites
         * @param {object} dimensions Working width and height
         */
        trim: function (sprites, dimensions) {
            var w = 0;
            var h = 0;

            $.map(sprites, function (sprite) {
                w = w > sprite.x + sprite.width ? w : sprite.x + sprite.width;
                h = h > sprite.y + sprite.height ? h : sprite.y + sprite.height;
            });

            dimensions.width = w || dimensions.width;
            dimensions.height = h || dimensions.height;
        },

        /**
         * ### stitches.makeSpritesheet
         * Make an image using the browser canvas element's drawing context.
         * Triggers a non-fatal error if anything fails
         *
         * @param {array} sprites A list of sprites
         * @param {object} dimensions Working width and height
         * @return string
         */
        makeSpritesheet: function (sprites, dimensions) {
            var canvas;
            var context;
            var spritesheet;

            canvas = document.createElement("canvas");
            canvas.width = dimensions.width;
            canvas.height = dimensions.height;

            try {
                context = canvas.getContext("2d");

                $.map(sprites, function (sprite) {
                    var x = sprite.x + sprite.padding;
                    var y = sprite.y + sprite.padding;

                    context.drawImage(sprite.image, x, y);
                });

                spritesheet = canvas.toDataURL("image/png");
            } catch (e) {
                this.$element.trigger("error", [e]);
            }

            return spritesheet;
        },

        /**
         * ### stitches.makeStylesheet
         * Make a CSS stylesheet to place images with spritesheet
         *
         * @param {array} sprites A list of sprites
         * @param {string} spritesheet The data URL of the spritesheet
         * @param {string} prefix Used to create CSS classes
         * @param {boolean} uri Switch including image as data URI
         * @return string
         */
        makeStylesheet: function (sprites, spritesheet, prefix, uri) {
            var backgroundImage = uri ? spritesheet : "download.png";
            var stylesheet;

            sprites = sprites.sort(function (a, b) {
                return a.name < b.name ? -1 : 1;
            });

            var css = [
                "." + prefix + " {",
                "    background: url(" + backgroundImage + ") no-repeat;",
                "}\n"
            ];

            $.map(sprites, function (sprite) {
                css = css.concat([
                    "." + prefix + "-" + sprite.name + " {",
                    "    width: " + sprite.image.width + "px;",
                    "    height: " + sprite.image.height + "px;",
                    "    background-position: -" + sprite.x + "px -" + sprite.y + "px;",
                    "}\n"
                ]);
            });

            stylesheet = "data:text/plain," + encodeURIComponent(css.join("\n"));

            return stylesheet;
        },

        /**
         * ### stitches.dataToObjectURL
         * Convert base64 data or raw binary data to an object URL
         * See: http://stackoverflow.com/a/5100158/230483
         *
         * @param {string} dataURI
         * @return string
         */
        dataToObjectURL: function (dataURI) {
            var dataParts = dataURI.split(',');
            var byteString;

            // convert base64 to raw binary data held in a string
            if (dataParts[0].indexOf('base64') >= 0) {
                byteString = atob(dataParts[1]);
            } else {
                byteString = decodeURIComponent(dataParts[1]);
            }

            // separate out the mime component
            var mimeString = dataParts[0].split(':')[1].split(';')[0];

            // write the bytes of the string to an ArrayBuffer
            var bl = byteString.length;
            var ab = new ArrayBuffer(bl);
            var ia = new Uint8Array(ab);
            var i;
            for (i = 0; i < bl; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            // get the blob and create an object URL
            var blob = this.createBlob(ab, mimeString);
            var url = this.createObjectURL(blob);

            return url;
        },

        /**
         * ### stitches.createBlob
         * Polyfill
         */
        createBlob: function (arrayBuffer, mimeString) {
            var BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder;

            if (!BlobBuilder) {
                throw new Error("BlobBuilder is unsupported.");
            }

            var bb = new BlobBuilder();
            bb.append(arrayBuffer);

            return bb.getBlob(mimeString);
        },

        /**
         * ### stitches.createObjectURL
         * Polyfill
         */
        createObjectURL: function (file) {
            if (window.URL && window.URL.createObjectURL) {
                return window.URL.createObjectURL(file);
            }

            if (window.webkitURL && window.webkitURL.createObjectURL) {
                return window.webkitURL.createObjectURL(file);
            }

            throw new Error("createObjectURL is unsupported.");
        }
    };

});