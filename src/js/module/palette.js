// # module/palette
//
// ...
//
// > http://draeton.github.com/stitches<br/>
// > Copyright 2013, Matthew Cobbs<br/>
// > Licensed under the MIT license.
/*global require, define */

define(["jquery", "util/util", "module/toolbar"],
function ($, util, Toolbar) {

    "use strict";

    var defaults = {
        name: "",
        visible: false,
        actions: {},
        fields: {}
    };

    /**
     * ## Palette
     *
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
        init: function () {
            this._super("init", this, arguments);

            this.$element.toggleClass("in", this.visible);
        },

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

        open: function () {
            this.$element.addClass("in");
            this.visible = true;
        },

        close: function () {
            this.$element.removeClass("in");
            this.visible = false;
        },

        configure: function (properties) {
            var self = this;

            this.source = properties.source;

            $.each(properties.inputs, function (name, value) {
                var selector = "input[name=" + name + "]";
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