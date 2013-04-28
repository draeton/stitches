/**
 * # manager/stylesheet
 *
 * Methods for setting the canvas stylesheet type and making the stylesheets
 *
 * > http://draeton.github.io/stitches<br/>
 * > Copyright 2013 Matthew Cobbs<br/>
 * > Licensed under the MIT license.
 */

define([
    "wrap/jquery",
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
         * ### @set
         * Set the working stylesheet manager instance by type
         *
         * @param {string} type The stylesheet manager type
         */
        set: function (type) {
            var Manager;

            this.type = type || "css";
            Manager = managers[this.type];
            this.manager = new Manager();
        },

        /**
         * ### @getStylesheet
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

            return styles;
        },

        /**
         * ### @getMarkup
         * Returns markup for spritesheet example usage
         *
         * @param {array} options.sprites A list of sprites
         * @param {string} options.prefix Used to create CSS classes
         * @return string
         */
        getMarkup: function (options) {
            var sprites = options.sprites;
            var prefix = options.prefix;
            var tooltip = options.tooltip || false;

            var markup = this.manager.markup(sprites, prefix, tooltip);
            markup = markup.replace(/\\n/g, "\n");

            return markup;
        }
    };

});