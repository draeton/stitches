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

    // **Module definition**
    return {
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
         * ### util.dataToObjectURL
         * Convert base64 data or raw binary data to an object URL
         * See: http://stackoverflow.com/a/5100158/230483
         *
         * @param {string} dataURI
         * @return string
         */
        dataToObjectURL: function (dataURI) {
            var dataParts = dataURI.split(',');
            var byteString;

            // convert base64 to raw binary data held in a string
            if (dataParts[0].indexOf('base64') >= 0) {
                byteString = atob(dataParts[1]);
            } else {
                byteString = decodeURIComponent(dataParts[1]);
            }

            // separate out the mime component
            var mimeString = dataParts[0].split(':')[1].split(';')[0];

            // write the bytes of the string to an ArrayBuffer
            var bl = byteString.length;
            var ab = new ArrayBuffer(bl);
            var ia = new Uint8Array(ab);
            var i;
            for (i = 0; i < bl; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            // get the blob and create an object URL
            var blob = this.createBlob(ab, mimeString);
            var url = this.createObjectURL(blob);

            return url;
        },

        /**
         * ### util.createBlob
         * Polyfill
         */
        createBlob: function (arrayBuffer, mimeString) {
            var BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder;

            if (!BlobBuilder) {
                throw new Error("BlobBuilder is unsupported.");
            }

            var bb = new BlobBuilder();
            bb.append(arrayBuffer);

            return bb.getBlob(mimeString);
        },

        /**
         * ### util.createObjectURL
         * Polyfill
         */
        createObjectURL: function (file) {
            if (window.URL && window.URL.createObjectURL) {
                return window.URL.createObjectURL(file);
            }

            if (window.webkitURL && window.webkitURL.createObjectURL) {
                return window.webkitURL.createObjectURL(file);
            }

            throw new Error("createObjectURL is unsupported.");
        }
    };

});