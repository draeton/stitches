/**
 * # stylesheet/css
 *
 * Base constructor for the CSS stylesheet manager
 *
 * > http://draeton.github.com/stitches<br/>
 * > Copyright 2013, Matthew Cobbs<br/>
 * > Licensed under the MIT license.
 */
/*global require, define */

define([
    "jquery",
    "util/util",
    "stylesheet/base"
],
function ($, util, BaseStylesheet) {

    "use strict";

    var defaults = {
        filename: "download.png"
    };

    /**
     * ## CssStylesheet
     *
     * Create a new `CssStylesheet` instance
     *
     * @constructor
     * @param {object} options
     */
    var CssStylesheet = function (options) {
        this.settings = $.extend({}, defaults, options);
    };

    util.inherit(CssStylesheet, BaseStylesheet, {
        /**
         * ### CssStylesheet.prototype.get
         * Returns a stylesheet to place images with spritesheet
         *
         * @param {array} sprites A list of sprites
         * @param {string} spritesheet The data URL of the spritesheet
         * @param {string} prefix Used to create CSS classes
         * @param {boolean} uri Switch including image as data URI
         * @return string
         */
        get: function (sprites, spritesheet, prefix, uri) {
            var backgroundImage = uri ? spritesheet : this.settings.filename;

            var styles = [
                "." + prefix + " {",
                "    background: url(" + backgroundImage + ") no-repeat;",
                "}\n"
            ];

            $.map(sprites, function (sprite) {
                styles = styles.concat([
                    "." + prefix + "-" + sprite.name + " {",
                    "    width: " + sprite.image.width + "px;",
                    "    height: " + sprite.image.height + "px;",
                    "    background-position: -" + sprite.left() + "px -" + sprite.top() + "px;",
                    "}\n"
                ]);
            });

            return styles;
        }
    });

    return CssStylesheet;

});