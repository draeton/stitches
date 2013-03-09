/**
 * # manager/file
 *
 * Methods for loading files to the canvas and giving updates on their
 * progress
 *
 * > http://draeton.github.com/stitches<br/>
 * > Copyright 2013 Matthew Cobbs<br/>
 * > Licensed under the MIT license.
 */

define([
    "wrap/jquery",
    "util/util"
],
function ($, util) {

    "use strict";

    // **Module definition**
    return {
        total: 0,
        processed: 0,
        queue: [],

        /**
         * ### file.set
         * Set the file manager handlers
         *
         * @param {object} handlers The handlers for various events
         */
        set: function (handlers) {
            handlers = handlers || {};

            this.onload = handlers.onload || this.noop;
            this.onprogress = handlers.onprogress || this.noop;
            this.onerror = handlers.onerror || this.noop;
        },

        /**
         * ### @noop
         * ...
         */
        noop: function () {},

        /**
         * ### @processFiles
         * ...
         */
        processFiles: function (files) {
            var self = this;

            this.total = files.length;
            this.processed = 0;
            this.queue = [];

            $.map(files, function (file) {
                if (/jpeg|png|gif/.test(file.type)) {
                    self.processFile(file);
                }
            });

            this.onprogress(0, "info");
        },

        /**
         * ### @processFile
         * ...
         */
        processFile: function (file) {
            var self = this;
            var reader;

            try {
                reader = new FileReader();
                reader.onloadend = function (e) {
                    var name = file.name;
                    var src = e.target.result;
                    var progress = ++self.processed / self.total;

                    self.onprogress(progress);
                    self.queue.push([name, src]);

                    if (self.queue.length === self.total) {
                        self.processQueue();
                    }
                };
                reader.readAsDataURL(file);
            } catch (e) {
                this.onerror(e);
            }
        },

        /**
         * ### @processQueue
         * ...
         */
        processQueue: function () {
            var self = this;

            $.map(this.queue, function (args) {
                self.onload.apply(self, args);
            });
        }
    };

});