/**
 * # module/toolbar
 *
 * ...
 *
 * > http://draeton.github.com/stitches<br/>
 * > Copyright 2013, Matthew Cobbs<br/>
 * > Licensed under the MIT license.
 */

define([
    "jquery"
],
function ($) {

    "use strict";

    var defaults = {
        name: "",
        actions: {}
    };

    /**
     * ## Toolbar
     *
     * Create a new `Toolbar` instance
     *
     * @constructor
     * @param {element} element
     * @param {object} options
     */
    var Toolbar = function (element, options) {
        this.$element = $(element);
        this.settings = $.extend({}, defaults, options);
        this.name = this.settings.name;
        this.actions = this.settings.actions;

        this.init();
    };

    Toolbar.classname = ".stitches-toolbar";

    Toolbar.prototype = {
        constructor: Toolbar,

        /**
         * ### Toolbar.prototype.init
         * ...
         */
        init: function () {
            this.bind();
        },

        /**
         * ### Toolbar.prototype.bind
         * ...
         */
        bind: function () {
            var self = this;

            $.each(this.actions, function (action, events) {
                $.each(events, function (event, callback) {
                    var selector = "[data-action=" + action + "]";
                    var handler = self.getHandler(self, callback);

                    if (action === "instance") {
                        self.$element.on(event, self.getHandler(self, handler));
                    } else {
                        self.$element.on(event, selector, handler);
                    }
                });
            });
        },

        /**
         * ### Toolbar.prototype.getHandler
         * ...
         */
        getHandler: function (context, callback) {
            return function (e) {
                var $target = $(e.currentTarget);

                if ($target.is(".disabled")) {
                    e.stopPropagation();
                    e.preventDefault();
                } else {
                    callback.apply(context, arguments);
                }
            };
        },

        /**
         * ### Toolbar.prototype.toggleActions
         * ...
         */
        toggleActions: function (actions, disable) {
            var self = this;

            if (typeof actions === "string") {
                actions = actions.split(" ");
            }

            $.map(actions, function (action) {
                var $tool = self.$element.find("[data-action=" + action + "]");

                $tool.toggleClass("disabled", disable);
            });
        },

        /**
         * ### Toolbar.prototype.enable
         * ...
         */
        enable: function (actions) {
            this.toggleActions(actions, false);
        },

        /**
         * ### Toolbar.prototype.disable
         * ...
         */
        disable: function (actions) {
            this.toggleActions(actions, true);
        }
    };

    return Toolbar;

});