/**
 * # stylesheet/sass
 *
 * Base constructor for the SASS stylesheet manager
 *
 * > http://draeton.github.io/stitches<br/>
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
        filename: "spritesheet.png"
    };

    /**
     * ## SassStylesheet
     * Create a new `SassStylesheet` instance
     *
     * @constructor
     * @param {object} options
     */
    var SassStylesheet = function (options) {
        this.settings = $.extend({}, defaults, options);
    };

    util.inherit(SassStylesheet, BaseStylesheet, {
        template: templates.sassMarkup,

        /**
         * ### @get
         * Returns a stylesheet to place images with spritesheet
         *
         * @param {array} sprites A list of sprites
         * @param {string} spritesheet The data URL of the spritesheet
         * @param {string} prefix Used to create CSS classes
         * @param {boolean} uri Switch including image as data URI
         * @return string
         */
        get: function (sprites, spritesheet, prefix, uri, width, height, units, exportNormalSize, exportPercentageSize) {
            var backgroundImage = uri ? spritesheet : this.settings.filename;

            return templates.sass({
                prefix: prefix,
                backgroundImage: backgroundImage,
                sprites: sprites,
                canvasWidth: width,
                canvasHeight: height,
                units: units,
				exportNormalSize: exportNormalSize, 
				exportPercentageSize: exportPercentageSize
            });
        }
    });

    return SassStylesheet;

});