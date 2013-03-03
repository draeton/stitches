/**
 * # util/stylesheet
 *
 * Utility methods for setting the canvas stylesheet type and making the
 * stylesheets
 *
 * > http://draeton.github.com/stitches<br/>
 * > Copyright 2013, Matthew Cobbs<br/>
 * > Licensed under the MIT license.
 */
/*global require, define */

define([
    "jquery",
    "stylesheet/css",
    "stylesheet/less"
],
function ($, CssStylesheet, LessStylesheet) {

    "use strict";

    // **Canvas stylesheet managers**
    var managers = {
        css: CssStylesheet,
        less: LessStylesheet
    };

    // **Module definition**
    return {
        /**
         * ### stylesheet.set
         * Set the working stylesheet manager instance by type
         *
         * @param {string} type The stylesheet manager type
         */
        set: function (type) {
            var Manager = managers[type] || managers.css;

            this.manager = new Manager();
        },

        /**
         * ### stylesheet.getStylesheet
         * Returns a stylesheet to place images with spritesheet
         *
         * @param {array} options.sprites A list of sprites
         * @param {string} options.spritesheet The data URL of the spritesheet
         * @param {string} options.prefix Used to create CSS classes
         * @param {boolean} options.uri Switch including image as data URI
         * @return string
         */
        getStylesheet: function (options) {
            var sprites = options.sprites;
            var spritesheet = options.spritesheet;
            var prefix = options.prefix;
            var uri = options.uri;

            var styles = this.manager.get(sprites, spritesheet, prefix, uri);
            styles = styles.replace(/\\n/g, "\n");

            return "data:text/plain," + encodeURIComponent(styles);
        }
    };

});