/**
 * # stylesheet/base
 *
 * Base constructor for the stylesheet managers
 *
 * > http://draeton.github.com/stitches<br/>
 * > Copyright 2013 Matthew Cobbs<br/>
 * > Licensed under the MIT license.
 */

define([
    "jquery"
],
function ($) {

    "use strict";

    var defaults = {
        filename: "download.png"
    };

    /**
     * ## BaseStylesheet
     *
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

        /**
         * ### BaseStylesheet.prototype.get
         * Returns a stylesheet to place images with spritesheet
         *
         * @param {array} sprites A list of sprites
         * @param {string} spritesheet The data URL of the spritesheet
         * @param {string} prefix Used to create CSS classes
         * @param {boolean} uri Switch including image as data URI
         * @return string
         */
        get: function (sprites, spritesheet, prefix, uri) {}
    };

    return BaseStylesheet;

});