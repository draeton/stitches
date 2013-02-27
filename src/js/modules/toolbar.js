// ## modules/toolbar
//
// [http://draeton.github.com/stitches](http://draeton.github.com/stitches)
//
// Copyright 2013, Matthew Cobbs
// Licensed under the MIT license.
//
/*global require, define */
define(["wrap/jquery"],
function ($) {

    var defaults = {
        name: "",
        actions: {}
    };

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

        init: function () {
            this.bind();
        },

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

        enable: function (actions) {
            this.toggleActions(actions, false);
        },

        disable: function (actions) {
            this.toggleActions(actions, true);
        }
    };

    return Toolbar;

});