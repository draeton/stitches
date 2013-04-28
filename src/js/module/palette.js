/**
 * # module/palette
 *
 * Constructor for UI palettes (i.e. dialogs). Inherits from `Toolbar`
 *
 * > http://draeton.github.io/stitches<br/>
 * > Copyright 2013 Matthew Cobbs<br/>
 * > Licensed under the MIT license.
 */

define([
    "wrap/jquery",
    "util/util",
    "module/toolbar"
],
function ($, util, Toolbar) {

    "use strict";

    var defaults = {
        name: "", // helpful for debugging
        visible: false, // UI state
        actions: {}, // named actions for events; set up with `bind`
        fields: {} // input fields; set up with `bind` and `configure`
    };

    /**
     * ## Palette
     * Create a new `Palette` instance
     *
     * @constructor
     * @param {element} element
     * @param {object} options
     */
    var Palette = function (element, options) {
        this.$element = $(element);
        this.settings = $.extend({}, defaults, options);
        this.name = this.settings.name;
        this.visible = this.settings.visible;
        this.actions = this.settings.actions;
        this.fields = this.settings.fields;
        this.source = null;

        this.init();
    };

    Palette.classname = ".stitches-palette";

    util.inherit(Palette, Toolbar, {
        /**
         * ### @init
         * Run methods to prepare the instance for use
         */
        init: function () {
            this._super("init", this, arguments);

            this.$element.toggleClass("in", this.visible);
        },

        /**
         * ### @bind
         * Bind event handlers to DOM element. `getHandler` is used to retain
         * this instance as the callback execution context. Loops through
         * `fields` to bind handlers on matching `name` attributes
         */
        bind: function () {
            var self = this;

            this._super("bind", this, arguments);

            $.each(this.fields, function (field, events) {
                $.each(events, function (event, callback) {
                    var selector = "[name=" + field + "]";
                    var handler = self.getHandler(self, callback);

                    self.$element.on(event, selector, handler);
                });
            });
        },

        /**
         * ### @open
         * Show this palette instance
         */
        open: function () {
            this.$element.addClass("in");
            this.visible = true;
        },

        /**
         * ### @close
         * Hide this palette instance
         */
        close: function () {
            this.$element.removeClass("in");
            this.visible = false;
        },

        /**
         * ### @configure
         * Configure the values of the inputs
         *
         * @param {object} properties Defines the data source and input values
         */
        configure: function (properties) {
            var self = this;

            this.source = properties.source; // reference object for other modules

            $.each(properties.inputs, function (name, value) {
                var selector = "[name=" + name + "]";
                var $input = self.$element.find(selector);
                var type = $input.attr("type");

                switch (type) {
                case "radio":
                case "checkbox":
                    $input = $input.removeAttr("checked").filter("[value=" + value + "]");
                    $input.attr("checked", "checked");
                    break;
                default:
                    $input.val(value);
                    break;
                }
            });
        }
    });

    return Palette;

});