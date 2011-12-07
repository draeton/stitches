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
        return {
            // ### getTemplates
            //
            // Fetch the jQuery templates used to construct the widget
            getTemplates: function () {                
                $.get(Stitches.settings.jsdir + "/stitches.html", function (html) {
                    $("body").append(html);
                    
                    // TODO consider converting template to bootstrap
                    
                    Stitches.Page.templates = {
                        stitches: Stitches.tmpl("stitches_tmpl"),
                        icon: Stitches.tmpl("stitches_icon_tmpl"),
                        style: Stitches.tmpl("stitches_style_tmpl")
                    };
                    
                    Stitches.pub("page.render");
                });
            },
            
            // ### render
            //
            // Creates the stitches widget and content
            render: function () {
                var $div = $(Stitches.Page.templates.stitches({}));
                $div.appendTo(Stitches.Page.$elem);

                // set dom element references
                Stitches.Page.setReferences();
            },

            // ### setReferences
            //
            // Cache jQuery selectors, then bind handlers to them
            setReferences: function () {
                Stitches.Page.$dropbox = $(".dropbox", Stitches.Page.$elem);
                Stitches.Page.$droplabel = $(".droplabel", Stitches.Page.$elem);
                Stitches.Page.$filelist = $(".filelist", Stitches.Page.$elem);
                Stitches.Page.$buttons = $(".buttons", Stitches.Page.$elem);
                Stitches.Page.buttons = {
                    $generate: $("a.generate", Stitches.Page.$buttons),
                    $clear: $("a.clear", Stitches.Page.$buttons),
                    $sprite: $("a.dlsprite", Stitches.Page.$buttons),
                    $stylesheet: $("a.dlstylesheet", Stitches.Page.$buttons)
                };

                /* bind handlers to generated element */
                Stitches.Page.bindHandlers();
            },

            // ### bindHandlers
            //
            // Bind all of the event listeners for the page
            bindHandlers: function () {
                Stitches.Page.$dropbox.each(function () {
                    this.addEventListener("dragenter", function () {
                            Stitches.Page.$dropbox.addClass("dropping")
                        }, false);
                    this.addEventListener("dragleave", function () {
                            Stitches.Page.$dropbox.removeClass("dropping")
                        }, false);
                    this.addEventListener("dragexit", function () {
                            Stitches.Page.$dropbox.removeClass("dropping")
                        }, false);
                    this.addEventListener("dragover", Stitches.Page.noopHandler, false);
                    this.addEventListener("drop", Stitches.Page.drop, false);
                });

                Stitches.Page.$buttons.delegate("a", "click", Stitches.Page.handleButtons);

                Stitches.Page.$filelist.delegate("a.remove", "click", Stitches.Page.removeFile);
            },

            // ### handleButtons
            //
            // One handler for all of the buttons; chooses action based on className
            //
            //     @param {Event} evt Click event
            //     @return {Boolean}
            handleButtons: function (evt) {
                evt.preventDefault();
                
                if (/disabled/.test(this.className)) {
                    return false;
                }

                if (/generate/.test(this.className)) {
                    Stitches.Page.setButtonDisabled(true, ["generate", "clear"]);
                    Stitches.generateStitches();
                    Stitches.Page.setButtonDisabled(false, ["generate", "clear"]);
                    return false;
                }

                if (/clear/.test(this.className)) {
                    Stitches.Page.clearFiles();
                    return false;
                }

                return true;
            },

            // ### setButtonDisabled
            //
            // Shortcut to disable or enable buttons. There's certainly a nicer way
            // of writing this
            //
            //     @param {Boolean} param Disabled (true) or enabled (false)
            //     @param {Array} buttons Which buttons to target
            setButtonDisabled: function (disabled, buttons) {
                var action = disabled ? "add" : "remove";

                $(buttons).each(function (idx, val) {
                    Stitches.Page.buttons["$" + val][action + "Class"]("disabled");
                });
            },

            // ### noopHandler
            //
            // Event handler dead-end
            //
            //     @param {Event} evt DOM event
            noopHandler: function (evt) {
                evt.stopPropagation();
                evt.preventDefault();
            },

            // ### drop
            //
            // Handles drop events; starts to process the files after
            // a drop
            //
            //     @param {Event} evt A DOM drop event
            //     @return {Type}
            drop: function (evt) {
                evt.stopPropagation();
                evt.preventDefault();

                Stitches.Page.$dropbox.removeClass("dropping");

                var e = evt || window.event;
                var files = (e.files || e.dataTransfer.files);

                if (files.length > 0) {
                    Stitches.Page.handleFiles(files);
                }
            },

            // ### handleFiles
            //
            // Loops through `files`; sends images to `addFile`
            //
            //     @param {FileList} files From a drop event
            handleFiles: function (files) {
                Stitches.filesQueue = 0;

                for (var i = 0, l = files.length; i < l; i++) {
                    var file = files[i];

                    if (/jpeg|png|gif/.test(file.type)) {
                        Stitches.Page.addFile(file);
                    }
                }
            },

            // ### addFile
            //
            // Increments the `filesQueue` to track when all images have been processed.
            // Starts up a new `FileReader` to read in the image as data
            //
            //     @param {File} file
            addFile: function (file) {
                Stitches.filesCount++;
                Stitches.filesQueue++;

                Stitches.Page.setButtonDisabled(true, ["generate", "clear", "sprite", "stylesheet"]);

                if (Stitches.filesCount === 1) {
                    Stitches.Page.$droplabel.fadeOut("fast");
                }

                var reader = new FileReader();
                reader.onloadend = Stitches.Page.handleFileLoad.bind(file);
                reader.readAsDataURL(file);
            },

            // ### handleFileLoad
            //
            // When the `FileReader` has loaded the file, this creates a new icon
            // and adds it to the file list in the widget
            //
            //     @param {Event} evt
            handleFileLoad: function (evt) {
                Stitches.filesQueue--;

                var icon = new Stitches.Icon(this.name, evt.target.result);
                var $li = $(Stitches.Page.templates.icon(icon)).data("icon", icon);
                Stitches.Page.$filelist.append($li);
                $li.fadeIn("fast");

                if (Stitches.filesQueue === 0) {
                    Stitches.Page.setButtonDisabled(false, ["generate", "clear"]);
                }
            },

            // ### removeFile
            //
            // Removes a file from the file list
            //
            //     @param {Event} evt
            removeFile: function (evt) {
                Stitches.Page.setButtonDisabled(true, ["sprite", "stylesheet"]);

                $(this).parent().fadeOut("fast", function () {
                    $(this).remove();
                });

                Stitches.filesCount--;
                if (Stitches.filesCount === 0) {
                    Stitches.Page.setButtonDisabled(true, ["generate", "clear"]);
                    Stitches.Page.$droplabel.fadeIn("fast");
                }

                return false;
            },

            // ### clearFiles
            //
            // Clear all files from the file list
            clearFiles: function () {
                Stitches.Page.$filelist.find("a.remove").each(function () {
                    Stitches.Page.removeFile.bind(this)();
                });
            }
        };
    })();

})(window, Stitches, jQuery);