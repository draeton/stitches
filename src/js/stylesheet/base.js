/**
 * # stylesheet/base
 *
 * Base constructor for the stylesheet managers
 *
 * > http://draeton.github.io/stitches<br/>
 * > Copyright 2013 Matthew Cobbs<br/>
 * > Licensed under the MIT license.
 */

define([
    "wrap/jquery"
],
function ($) {

    "use strict";

    var defaults = {
        filename: "spritesheet.png"
    };

    /**
     * ## BaseStylesheet
     * Create a new `BaseStylesheet` instance
     *
     * @constructor
     * @param {object} options
     */
    var BaseStylesheet = function (options) {
        this.settings = $.extend({}, defaults, options);
    };

    BaseStylesheet.prototype = {
        constructor: BaseStylesheet,

        template: null,

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
        get: function (sprites, spritesheet, prefix, uri) {},

        /**
         * ### @markup
         * Returns markup for spritesheet example usage
         *
         * @param {array} sprites A list of sprites
         * @param {string} prefix Used to create CSS classes
         * @param {boolean} tooltip If true display bootstrap tooltip
         * @return string
         */
        markup: function (sprites, prefix, tooltip) {
            return this.template({
                prefix: prefix,
                sprites: sprites,
                tooltip: tooltip
            });
        }
    };

    return BaseStylesheet;

});