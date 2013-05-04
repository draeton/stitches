/**
 * # util/util
 *
 * This is the home for wayward methods who have lost their way.
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
         * ### @inherit
         * Set up prototypical inheritance
         *
         * @param {function} Child Constructor
         * @param {function} Parent Constructor
         * @param {object} methods To add to Child.prototype
         */
        inherit: function (Child, Parent, methods) {
            Child.prototype = new Parent();
            Child.prototype.constructor = Parent;

            $.each(methods, function (name, method) {
                Child.prototype[name] = method;
            });

            Child.prototype._super = function (name, context, args) {
                var method = Parent.prototype[name];

                return method.apply(context, args);
            };
        },

        /**
         * ### @debounce
         * Prevent a function from being called more than once within
         * a certain threshold
         *
         * @param {function} func Function to modify
         * @param {number} threshold In ms
         * @param {boolean} execAsap If true, run function on first call
         * @return function
         */
        debounce: function (func, threshold, execAsap) {
            var timeout;

            return function () {
                var context = this;
                var args = arguments;

                var delayed = function () {
                    if (!execAsap) {
                        func.apply(context, args);
                    }

                    timeout = null;
                };

                if (timeout) {
                    window.clearTimeout(timeout);
                } else if (execAsap) {
                    func.apply(context, args);
                }

                timeout = setTimeout(delayed, threshold || 50);
            };
        },

        /**
         * ### @noop
         * No operation
         *
         * @param {event} e Optional
         */
        noop: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
        },

        /**
         * ### @toPx
         * Convet a number to px for stylesheets
         *
         * @param {string} num Pixel value
         * @return string
         */
        toPx: function (num) {
            return num ? num + "px" : "0";
        }
    };

});