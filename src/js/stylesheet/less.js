/**
 * # stylesheet/less
 *
 * Base constructor for the LESS stylesheet manager
 *
 * > http://draeton.github.com/stitches<br/>
 * > Copyright 2013 Matthew Cobbs<br/>
 * > Licensed under the MIT license.
 */

define([
    "wrap/jquery",
    "util/util",
    "util/templates",
    "stylesheet/base"
],
function ($, util, templates, BaseStylesheet) {

    "use strict";

    var defaults = {
        filename: "download.png"
    };

    /**
     * ## LessStylesheet
     *
     * Create a new `LessStylesheet` instance
     *
     * @constructor
     * @param {object} options
     */
    var LessStylesheet = function (options) {
        this.settings = $.extend({}, defaults, options);
    };

    util.inherit(LessStylesheet, BaseStylesheet, {
        /**
         * ### LessStylesheet.prototype.get
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

            return templates.less({
                prefix: prefix,
                backgroundImage: backgroundImage,
                sprites: sprites
            });
        }
    });

    return LessStylesheet;

});