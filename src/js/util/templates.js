/**
 * # util/templates
 *
 * Utility methods for referencing js templates
 *
 * > http://draeton.github.com/stitches<br/>
 * > Copyright 2013, Matthew Cobbs<br/>
 * > Licensed under the MIT license.
 */
/*global require, define */

define([
    "tpl!../../templates/stitches.html",
    "tpl!../../templates/sprite.html"
],
function (stitchesTemplate, spriteTemplate) {

    "use strict";

    // **Module definition**
    return {
        /**
         * ### templates.stitches
         * Returns the `Stitches` template
         *
         * @return string
         */
        stitches: function () {
            return stitchesTemplate;
        },

        /**
         * ### templates.sprite
         * Returns the `Sprite` template
         *
         * @return string
         */
        sprite: function () {
            return spriteTemplate;
        }
    };

});