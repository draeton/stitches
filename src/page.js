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

        /* shortcut */
        var S = window.Stitches;

        /* true when the widget has rendered */
        var rendered = false;

        return {
            // ### fetchTemplates
            //
            // Fetch the jQuery templates used to construct the widget
            //
            //     @return {jqXHR}
            fetchTemplates: function () {
                return $.get(S.settings.jsdir + "/stitches.html", function (html) {
                    $("body").append(html);

                    S.Page.templates = {
                        stitches: S.tmpl("stitches_tmpl"),
                        icon:     S.tmpl("stitches_icon_tmpl")
                    };

                    /* notify */
                    S.pub("page.templates.done");
                });
            },

            // ### render
            //
            // Creates the stitches widget and content
            render: function () {
                var $div = $(S.Page.templates.stitches({}));
                $div.appendTo(S.Page.$elem);

                // set dom element references
                S.Page.$stitches = $(".stitches", S.Page.$elem);
                S.Page.$drawer = $(".drawer", S.Page.$elem);
                S.Page.$dropbox = $(".dropbox", S.Page.$elem);
                S.Page.$droplabel = $(".droplabel", S.Page.$elem);
                S.Page.$filelist = $(".filelist", S.Page.$elem);
                S.Page.$buttons = $(".buttons", S.Page.$elem);
                S.Page.buttons = {
                    $generate:   $("a.generate", S.Page.$buttons),
                    $clear:      $("a.clear", S.Page.$buttons),
                    $sprite:     $("a.dlsprite", S.Page.$buttons),
                    $stylesheet: $("a.dlstylesheet", S.Page.$buttons)
                };

                // set options
                S.Page.$options = $(".options", S.Page.$elem);
                S.Page.inputs = {
                    $prefix:     $("input[name=prefix]", S.Page.$options),
                    $padding:    $("input[name=padding]", S.Page.$options),
                    $dataURI:    $("input[name=dataURI]", S.Page.$options)
                };
                S.Page.inputs.$prefix.val(S.settings.prefix);
                S.Page.inputs.$padding.val(S.settings.padding);
                S.Page.inputs.$dataURI.filter("[value=" + S.settings.dataURI + "]").attr("checked", true);

                /* notify */
                rendered = true;
                S.pub("page.render.done");
            },

            // ## errorHandler
            //
            // Handles all error messages
            errorHandler: function (e) {
                if (rendered) {
                    S.Page.$droplabel.html("&times; " + e.message).addClass("error");
                }
                throw e;
            },

            // ## subscribe
            //
            // Handles all subscriptions
            subscribe: function () {
                var buttons = S.Page.buttons;
                var $droplabel = S.Page.$droplabel;

                /* handle drop label and buttons on queue length changes */
                S.sub("file.icon.done", function (icon) {
                    if (S.iconQueue.length === 1) {
                        $droplabel.fadeOut("fast");
                        buttons.$generate.removeClass("disabled");
                        buttons.$clear.removeClass("disabled");
                    }
                    buttons.$sprite.addClass("disabled");
                    buttons.$stylesheet.addClass("disabled");
                });
                S.sub("file.remove.done", function (icon) {
                    if (S.iconQueue.length < 1) {
                        $droplabel.fadeIn("fast");
                        buttons.$generate.addClass("disabled");
                        buttons.$clear.addClass("disabled");
                    }
                    buttons.$sprite.addClass("disabled");
                    buttons.$stylesheet.addClass("disabled");
                });

                /* handle sprite and stylesheet generation */
                S.sub("sprite.generate.done", function (sprite, stylesheet) {
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
                var dropbox = S.Page.$dropbox.get(0);
                dropbox.addEventListener("dragenter", S.Page._dragStart, false);
                dropbox.addEventListener("dragleave", S.Page._dragStop, false);
                dropbox.addEventListener("dragexit",  S.Page._dragStop, false);
                dropbox.addEventListener("dragover",  S.Page._noop, false);
                dropbox.addEventListener("drop",      S.Page._drop, false);
            },

            // #### *Private drag and drop methods*
            _dragStart: function (e) {
                S.Page.$dropbox.addClass("dropping");
            },

            _dragStop: function (e) {
                if ($(e.target).parents(".dropbox").length === 0) {
                    S.Page.$dropbox.removeClass("dropping");
                }
            },

            _drop: function (e) {
                e.stopPropagation();
                e.preventDefault();
                S.Page.$dropbox.removeClass("dropping");

                var evt = e || window.event;
                var files = (evt.files || evt.dataTransfer.files);
                if (files.length > 0) {
                    S.pub("page.drop.done", files);
                }
            },

            // ### bindButtons
            //
            // Bind all of the event listeners for buttons
            bindButtons: function () {
                var $elem = S.Page.$elem;
                $elem.delegate("a.disabled", "click", S.Page._noop);
                $elem.delegate("a.generate", "click", S.Page._generate);
                $elem.delegate("a.remove", "click",   S.Page._removeFile);
                $elem.delegate("a.clear", "click",    S.Page._removeAllFiles);
            },

            // ### bindCabinet
            //
            // Bind all of the event listeners for the cabinet
            bindCabinet: function () {
                var $elem = S.Page.$elem;
                var $stitches = S.Page.$stitches;
                var $options = S.Page.$options;
                var $drawer = S.Page.$drawer;
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
                        S.pub("page.drop.done", this.files);
                    }
                    $cabinet.trigger("reset");
                });

                // open options
                $drawer.delegate("a.open-options", "click", function () {
                    $options.fadeIn();
                });
            },

            // ### bindOptions
            //
            // Bind all of the event listeners for the options panel
            bindOptions: function () {
                var $options = S.Page.$options;
                var buttons = S.Page.buttons;

                $options.delegate("a.close-options", "click", function () {
                    $options.fadeOut();
                });

                $options.delegate("input", "change", function () {
                    buttons.$sprite.addClass("disabled");
                    buttons.$stylesheet.addClass("disabled");
                });

                $options.delegate("input[name=prefix]", "change", function () {
                    S.settings.prefix = S.Page.inputs.$prefix.val();
                });

                $options.delegate("input[name=padding]", "change", function () {
                    var padding = S.Page.inputs.$padding.val();
                    S.settings.padding = +padding;
                    S.Page.updateIconDimensions();
                });

                $options.delegate("input[name=dataURI]", "change", function () {
                    var dataURI = S.Page.inputs.$dataURI.filter(":checked").val();
                    S.settings.dataURI = dataURI === "true" ? true : false;
                });
            },

            // #### *Private button methods*
            _generate: function (e) {
                /* [].concat to copy array */
                S.pub("sprite.generate", [].concat(S.iconQueue));
            },

            _removeFile: function (e) {
                var icon = $(this).parent("li").data("icon");
                S.pub("file.unqueue", icon);
            },

            _removeAllFiles: function (e) {
                S.pub("file.unqueue.all");
            },

            // ### addIcon
            //
            // Add an icon to the file list
            //     @param {Icon} icon
            addIcon: function (icon) {
                $(S.Page.templates.icon(icon))
                    .data("icon", icon)
                    .appendTo(S.Page.$filelist)
                    .fadeIn("fast");
            },

            // ### removeIcon
            //
            // Remove an icon from the file list
            //     @param {Icon} icon
            removeIcon: function (icon) {
                S.Page.$filelist.find("li")
                    .filter(function () {
                        return $(this).data("icon") === icon;
                    })
                    .fadeOut("fast")
                    .remove();
            },

            // ### updateIconDimensions
            //
            // Update icon dimensions after changing padding setting
            updateIconDimensions: function () {
                var padding = S.settings.padding;

                $.each(S.iconQueue, function (i, icon) {
                    icon.width = icon.image.width + padding;
                    icon.height = icon.image.height + padding;
                });
            }
        };
    })();

})(window, Stitches, jQuery);