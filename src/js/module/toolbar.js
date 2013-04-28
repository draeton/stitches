/**
 * # module/toolbar
 *
 * Constructor for UI toolbars
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

    var defaults = {
        name: "", // helpful for debugging
        actions: {} // named actions for events; set up with `bind`
    };

    /**
     * ## Toolbar
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
         * ### @init
         * Run methods to prepare the instance for use
         */
        init: function () {
            this.bind();
        },

        /**
         * ### @bind
         * Bind event handlers to DOM element. `getHandler` is used to retain
         * this instance as the callback execution context. Loops through
         * `actions` to bind handlers on matching `data-action` attributes
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
         * ### @getHandler
         * Returns an event handler that maintains context and aborts if
         * the target is disabled
         *
         * @param {object} context Execution context
         * @param {function} callback Handler callback function
         * @return function
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
         * ### @toggleActions
         * Enable or disable toolbar actions based on a flag
         *
         * @param {string} actions Space-delimited string of action names
         * @param {boolean} disable If true, disable these actions
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
         * ### @enable
         * Short-hand for `toggleActions` to enable
         *
         * @param {string} actions Space-delimited string of action names
         */
        enable: function (actions) {
            this.toggleActions(actions, false);
        },

        /**
         * ### @disable
         * Short-hand for `toggleActions` to disable
         *
         * @param {string} actions Space-delimited string of action names
         */
        disable: function (actions) {
            this.toggleActions(actions, true);
        }
    };

    return Toolbar;

});