// ## Stitches.Page
//
// [http://draeton.github.com/stitches](http://draeton.github.com/stitches)
//
// Copyright 2011, Matthew Cobbs
// Licensed under the MIT license.
//
/*global jQuery, Stitches */
(function (window, Stitches, $) {

    "use strict";

    // ## Stitches.Page namespace
    //
    // Holds all DOM interaction methods
    Stitches.Page = (function () {

        var rendered = false;

        return {
            // ### fetchTemplates
            //
            // Fetch the jQuery templates used to construct the widget
            //
            //     @return {jqXHR}
            fetchTemplates: function () {
                return $.get(Stitches.settings.jsdir + "/stitches.html", function (html) {
                    $("body").append(html);

                    Stitches.Page.templates = {
                        stitches: Stitches.tmpl("stitches_tmpl"),
                        icon:     Stitches.tmpl("stitches_icon_tmpl")
                    };

                    /* notify */
                    Stitches.pub("page.templates.done");
                });
            },

            // ### render
            //
            // Creates the stitches widget and content
            render: function () {
                var $div = $(Stitches.Page.templates.stitches({}));
                $div.appendTo(Stitches.Page.$elem);

                // set dom element references
                Stitches.Page.$stitches = $(".stitches", Stitches.Page.$elem);
                Stitches.Page.$drawer = $(".drawer", Stitches.Page.$elem);
                Stitches.Page.$dropbox = $(".dropbox", Stitches.Page.$elem);
                Stitches.Page.$droplabel = $(".droplabel", Stitches.Page.$elem);
                Stitches.Page.$filelist = $(".filelist", Stitches.Page.$elem);
                Stitches.Page.$buttons = $(".buttons", Stitches.Page.$elem);
                Stitches.Page.buttons = {
                    $generate:   $("a.generate", Stitches.Page.$buttons),
                    $clear:      $("a.clear", Stitches.Page.$buttons),
                    $sprite:     $("a.dlsprite", Stitches.Page.$buttons),
                    $stylesheet: $("a.dlstylesheet", Stitches.Page.$buttons)
                };

                // set options
                Stitches.Page.$options = $(".options", Stitches.Page.$elem);
                Stitches.Page.inputs = {
                    $prefix:     $("input[name=prefix]", Stitches.Page.$options),
                    $padding:    $("input[name=padding]", Stitches.Page.$options),
                    $dataURI:    $("input[name=dataURI]", Stitches.Page.$options)
                };
                Stitches.Page.inputs.$prefix.val(Stitches.settings.prefix);
                Stitches.Page.inputs.$padding.val(Stitches.settings.padding);
                Stitches.Page.inputs.$dataURI.filter("[value=" + Stitches.settings.dataURI + "]").attr("checked", true);

                /* notify */
                rendered = true;
                Stitches.pub("page.render.done");
            },

            // ## errorHandler
            //
            // Handles all error messages
            errorHandler: function (e) {
                if (rendered) {
                    Stitches.Page.$droplabel.html("&times; " + e.message).addClass("error");
                }
                throw e;
            },

            // ## subscribe
            //
            // Handles all subscriptions
            subscribe: function () {
                var buttons = Stitches.Page.buttons;
                var $droplabel = Stitches.Page.$droplabel;

                /* handle drop label and buttons on queue length changes */
                Stitches.sub("file.icon.done", function (icon) {
                    if (Stitches.iconQueue.length === 1) {
                        $droplabel.fadeOut("fast");
                        buttons.$generate.removeClass("disabled");
                        buttons.$clear.removeClass("disabled");
                    }
                    buttons.$sprite.addClass("disabled");
                    buttons.$stylesheet.addClass("disabled");
                });
                Stitches.sub("file.remove.done", function (icon) {
                    if (Stitches.iconQueue.length < 1) {
                        $droplabel.fadeIn("fast");
                        buttons.$generate.addClass("disabled");
                        buttons.$clear.addClass("disabled");
                    }
                    buttons.$sprite.addClass("disabled");
                    buttons.$stylesheet.addClass("disabled");
                });

                /* handle sprite and stylesheet generation */
                Stitches.sub("sprite.generate.done", function (sprite, stylesheet) {
                    buttons.$sprite.attr("href", sprite).removeClass("disabled");
                    buttons.$stylesheet.attr("href", stylesheet).removeClass("disabled");
                });
            },

            // #### *Private no operation method*
            _noop: function (e) {
                e.preventDefault();
                e.stopPropagation();
            },

            // ### bindDragAndDrop
            //
            // Bind all of the event listeners for drag and drop
            bindDragAndDrop: function () {
                var dropbox = Stitches.Page.$dropbox.get(0);
                dropbox.addEventListener("dragenter", Stitches.Page._dragStart, false);
                dropbox.addEventListener("dragleave", Stitches.Page._dragStop, false);
                dropbox.addEventListener("dragexit",  Stitches.Page._dragStop, false);
                dropbox.addEventListener("dragover",  Stitches.Page._noop, false);
                dropbox.addEventListener("drop",      Stitches.Page._drop, false);
            },

            // #### *Private drag and drop methods*
            _dragStart: function (e) {
                Stitches.Page.$dropbox.addClass("dropping");
            },

            _dragStop: function (e) {
                if ($(e.target).parents(".dropbox").length === 0) {
                    Stitches.Page.$dropbox.removeClass("dropping");
                }
            },

            _drop: function (e) {
                e.stopPropagation();
                e.preventDefault();
                Stitches.Page.$dropbox.removeClass("dropping");

                var evt = e || window.event;
                var files = (evt.files || evt.dataTransfer.files);
                if (files.length > 0) {
                    Stitches.pub("page.drop.done", files);
                }
            },

            // ### bindButtons
            //
            // Bind all of the event listeners for buttons
            bindButtons: function () {
                var $elem = Stitches.Page.$elem;
                $elem.delegate("a.disabled", "click", Stitches.Page._noop);
                $elem.delegate("a.generate", "click", Stitches.Page._generate);
                $elem.delegate("a.remove", "click",   Stitches.Page._removeFile);
                $elem.delegate("a.clear", "click",    Stitches.Page._removeAllFiles);
            },

            // ### bindCabinet
            //
            // Bind all of the event listeners for the cabinet
            bindCabinet: function () {
                var $elem = Stitches.Page.$elem;
                var $stitches = Stitches.Page.$stitches;
                var $options = Stitches.Page.$options;
                var $drawer = Stitches.Page.$drawer;
                var $cabinet = $("form.cabinet", $drawer);
                var $input = $("input.files", $drawer);

                // show file input on hover
                $stitches.hover(function () {
                    $drawer.stop().animate({left: "-5px"}, 250);
                }, function () {
                    $drawer.stop().animate({left: "-125px"}, 250);
                });

                // on change event, use the drop event to handle files
                $input.bind("change", function () {
                    if (this.files.length) {
                        Stitches.pub("page.drop.done", this.files);
                    }
                    $cabinet.trigger("reset");
                });

                // open options
                $drawer.delegate("a.open", "click", function () {
                    $options.fadeIn();
                });
            },

            // ### bindOptions
            //
            // Bind all of the event listeners for the options panel
            bindOptions: function () {
                var $options = Stitches.Page.$options;
                var buttons = Stitches.Page.buttons;

                $options.delegate("a.close", "click", function () {
                    $options.fadeOut();
                });

                $options.delegate("input", "change", function () {
                    buttons.$sprite.addClass("disabled");
                    buttons.$stylesheet.addClass("disabled");
                });

                $options.delegate("input[name=prefix]", "change", function () {
                    Stitches.settings.prefix = Stitches.Page.inputs.$prefix.val();
                });

                $options.delegate("input[name=padding]", "change", function () {
                    var padding = Stitches.Page.inputs.$padding.val();
                    Stitches.settings.padding = +padding;
                });

                $options.delegate("input[name=dataURI]", "change", function () {
                    var dataURI = Stitches.Page.inputs.$dataURI.filter(":checked").val();
                    Stitches.settings.dataURI = dataURI === "true" ? true : false;
                });
            },

            // #### *Private button methods*
            _generate: function (e) {
                /* [].concat to copy array */
                Stitches.pub("sprite.generate", [].concat(Stitches.iconQueue));
            },

            _removeFile: function (e) {
                var icon = $(this).parent("li").data("icon");
                Stitches.pub("file.unqueue", icon);
            },

            _removeAllFiles: function (e) {
                Stitches.pub("file.unqueue.all");
            },

            // ### addIcon
            //
            // Add an icon to the file list
            //     @param {Icon} icon
            addIcon: function (icon) {
                $(Stitches.Page.templates.icon(icon))
                    .data("icon", icon)
                    .appendTo(Stitches.Page.$filelist)
                    .fadeIn("fast");
            },

            // ### removeIcon
            //
            // Remove an icon from the file list
            //     @param {Icon} icon
            removeIcon: function (icon) {
                Stitches.Page.$filelist.find("li")
                    .filter(function () {
                        return $(this).data("icon") === icon;
                    })
                    .fadeOut("fast")
                    .remove();
            }
        };
    })();

})(window, Stitches, jQuery);