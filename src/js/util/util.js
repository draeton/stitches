// # util/util
//
// ...
//
// > http://draeton.github.com/stitches<br/>
// > Copyright 2013, Matthew Cobbs<br/>
// > Licensed under the MIT license.
/*global require, define */

define(["jquery"],
function ($) {

    "use strict";

    return {
        proxy: function (context, methods) {
            if (typeof methods === "string") {
                methods = methods.split(" ");
            }

            $.map(methods, function (method) {
                context[method] = $.proxy(context[method], context);
            });
        },

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

        removeValue: function (array, value) {
            return $(array).filter(function () {
                return this !== value;
            });
        },

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

        cleanName: function (name) {
            name = name.replace(/\.[a-z]{3,4}$/i, "");
            name = name.replace(/[\s.]+/gi, "-").replace(/[^a-z0-9\-]/gi, "_");

            return name;
        }
    };

});