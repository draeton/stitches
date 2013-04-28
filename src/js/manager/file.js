/**
 * # manager/file
 *
 * Methods for loading files to the canvas and giving updates on their
 * progress
 *
 * > http://draeton.github.io/stitches<br/>
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
        total: 0, // total count of files
        processed: 0, // total count of processed files
        queue: [], // queue after reading; used to process

        /**
         * ### file.set
         * Set the file manager handlers
         *
         * @param {object} handlers The handlers for various events
         */
        set: function (handlers) {
            handlers = handlers || {};

            this.onload = handlers.onload || util.noop;
            this.onprogress = handlers.onprogress || util.noop;
            this.onerror = handlers.onerror || util.noop;
        },

        /**
         * ### @processFiles
         * Reset the queue and start processing a list of files
         *
         * @param {array} files An array of files from one of the file inputs
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
         * Use the FileReader to read in image files from input, and add
         * them to the queue. When all files are read, the queue is then
         * processed
         *
         * @param {object} file From a file input
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
         * Loop over the queue and apply the onload callback to each
         * item
         */
        processQueue: function () {
            var self = this;

            $.map(this.queue, function (args) {
                self.onload.apply(self, args);
            });
        }
    };

});