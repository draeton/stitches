// ## util/stitches
//
// [http://draeton.github.com/stitches](http://draeton.github.com/stitches)
//
// Copyright 2013, Matthew Cobbs
// Licensed under the MIT license.
//
/*global require, define */
define(["wrap/jquery", "layouts/compact", "layouts/vertical", "layouts/horizontal"],
function ($, CompactLayout, VerticalLayout, HorizontalLayout) {

    "use strict";

    var layouts = {
        compact: CompactLayout,
        vertical: VerticalLayout,
        horizontal: HorizontalLayout
    };

    return {
        setLayout: function (type) {
            var selected = layouts[type] || layouts.compact;

            this.layout = new selected();
        },

        getDimensions: function (sprites, defaults) {
            return this.layout.getDimensions(sprites, defaults);
        },

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

        trim: function (placed, dimensions) {
            var w = 0;
            var h = 0;

            $.map(placed, function (sprite) {
                w = w > sprite.x + sprite.width ? w : sprite.x + sprite.width;
                h = h > sprite.y + sprite.height ? h : sprite.y + sprite.height;
            });

            dimensions.width = w || dimensions.width;
            dimensions.height = h || dimensions.height;
        },

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

        createBlob: function (arrayBuffer, mimeString) {
            var BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder;

            if (!BlobBuilder) {
                throw new Error("BlobBuilder is unsupported.");
            }

            var bb = new BlobBuilder();
            bb.append(arrayBuffer);

            return bb.getBlob(mimeString);
        },

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