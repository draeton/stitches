/**
 * # util/array
 *
 * Utility methods for working with arrays
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

    // **Module definition**
    return {
        /**
         * ### @remove
         * Remove from an array by value
         *
         * @param {array} list The array to filter
         * @param {*} value Any items matching value are removed
         * @return array
         */
        remove: function (array, value) {
            return $(array).filter(function () {
                return this !== value;
            });
        }
    };

});