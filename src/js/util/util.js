/**
 * # util/util
 *
 * This is the home for wayward methods who have lost their way.
 *
 * > http://draeton.github.com/stitches<br/>
 * > Copyright 2013, Matthew Cobbs<br/>
 * > Licensed under the MIT license.
 */
/*global require, define */

define([
    "jquery"
],
function ($) {

    "use strict";

    // Module definition
    return {
        /**
         * ### util.proxy
         * Bind methods to a specific context
         *
         * @param {object} context The binding execution context
         * @param {string|array} methods Space-separated string or array
         */
        proxy: function (context, methods) {
            if (typeof methods === "string") {
                methods = methods.split(" ");
            }

            $.map(methods, function (method) {
                context[method] = $.proxy(context[method], context);
            });
        },

        /**
         * ### util.inherit
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
         * ### util.debounce
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
         * ### util.cleanName
         * Remove special characters and other markers from a string
         * to be used as a sprite name
         *
         * @param {string} name The name of the sprite
         * @return string
         */
        cleanName: function (name) {
            name = name.replace(/\.\w+$/i, ""); // file extension
            name = name.replace(/[\s.]+/gi, "-"); // spaces to -
            name = name.replace(/[^a-z0-9\-]/gi, "_"); // other to _

            return name;
        }
    };

});