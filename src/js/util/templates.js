/**
 * # util/templates
 *
 * Utility methods for referencing js templates
 *
 * > http://draeton.github.com/stitches<br/>
 * > Copyright 2013 Matthew Cobbs<br/>
 * > Licensed under the MIT license.
 */

define([
    "tpl!../../templates/stitches.tpl",
    "tpl!../../templates/downloads.tpl",
    "tpl!../../templates/sprite.tpl",
    "tpl!../../templates/css.tpl",
    "tpl!../../templates/less.tpl",
    "tpl!../../templates/markup.tpl"
],
function (stitchesTemplate, downloadsTemplate, spriteTemplate, cssTemplate, lessTemplate, markupTemplate) {

    "use strict";

    // **Module definition**
    return {
        /**
         * ### templates.stitches
         * Returns the app template
         *
         * @return string
         */
        stitches: function () {
            return stitchesTemplate.apply(this, arguments);
        },

        /**
         * ### templates.downloads
         * Returns the downloads template
         *
         * @return string
         */
        downloads: function () {
            return downloadsTemplate.apply(this, arguments);
        },

        /**
         * ### templates.sprite
         * Returns the sprite template
         *
         * @return string
         */
        sprite: function () {
            return spriteTemplate.apply(this, arguments);
        },

        /**
         * ### templates.css
         * Returns the css template
         *
         * @return string
         */
        css: function () {
            return cssTemplate.apply(this, arguments);
        },

        /**
         * ### templates.less
         * Returns the less template
         *
         * @return string
         */
        less: function () {
            return lessTemplate.apply(this, arguments);
        },

        /**
         * ### templates.markup
         * Returns the markup template
         *
         * @return string
         */
        markup: function () {
            return markupTemplate.apply(this, arguments);
        }
    };

});