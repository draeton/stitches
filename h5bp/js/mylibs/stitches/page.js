/*!
 * Stitches - HTML5 Sprite Generator
 * http://draeton.github.com/Stitches
 *
 * Copyright 2011, Matthew Cobbs
 * Licensed under the MIT license.
 */
/*global jQuery, Stitches */
(function (window, Stitches, $) {

    "use strict";

    Stitches.Page = (function () {
        return {
            init: function () {
                Stitches.Page.dropbox = $("#dropbox").get(0);
                Stitches.Page.$droplabel = $("#droplabel");
                Stitches.Page.$filelist = $("#filelist");
                Stitches.Page.$buttons = $("#buttons");
                Stitches.Page.buttons =  {
                	$generate: $("a.generate"),
                	$clear: $("a.clear"),
                	$sprite: $("a.sprite"),
                	$stylesheet: $("a.stylesheet")
                };

                Stitches.Page.getTemplates();
                Stitches.Page.bindHandlers();
            },

            getTemplates: function (callback) {
                $.get("templates.html", function (data) {
                    $("body").append(data);
                    Stitches.Page.hasTemplates = true;
                    if (callback) {
                        callback();
                    }
                });
            },

            bindHandlers: function () {
                Stitches.Page.dropbox.addEventListener("dragenter", Stitches.Page.noopHandler, false);
                Stitches.Page.dropbox.addEventListener("dragexit", Stitches.Page.noopHandler, false);
                Stitches.Page.dropbox.addEventListener("dragover", Stitches.Page.noopHandler, false);
                Stitches.Page.dropbox.addEventListener("drop", Stitches.Page.drop, false);

            	Stitches.Page.$buttons.delegate("a", "click", Stitches.Page.handleButtons);

            	Stitches.Page.$filelist.delegate("a.remove", "click", Stitches.Page.removeFile);
            },

            handleButtons: function (evt) {
                if (/disabled/.test(this.className)) {
                    return false;
                }

                if (/generate/.test(this.className)) {
                    Stitches.Page.toggleButtons("add", ["generate", "clear"]);
                    Stitches.generateStitches();
                    Stitches.Page.toggleButtons("remove", ["generate", "clear"]);
                    return false;
                }

                if (/clear/.test(this.className)) {
                    Stitches.Page.clearFiles();
                    return false;
                }

                return true;
            },

            toggleButtons: function (action, buttons) {
                buttons.forEach(function (val, idx) {
                    Stitches.Page.buttons["$" + val][action + "Class"]("disabled");
                });
            },

            noopHandler: function (evt) {
                evt.stopPropagation();
                evt.preventDefault();
            },

            drop: function (evt) {
                evt.stopPropagation();
                evt.preventDefault();

                var files = evt.dataTransfer.files;

                if (files.length > 0) {
                    Stitches.Page.handleFiles(files);
                }
            },

            handleFiles: function (files) {
                Stitches.filesQueue = 0;

                for (var i = 0, l = files.length; i < l; i++) {
                    var file = files[i];

                    if (/jpeg|png|gif/.test(file.type)) {
                    	Stitches.Page.addFile(file);
                    }
                }
            },

            addFile: function (file) {
            	Stitches.filesCount++;
            	Stitches.filesQueue++;

                Stitches.Page.toggleButtons("add", ["generate", "clear", "sprite", "stylesheet"]);

            	if (Stitches.filesCount === 1) {
                    Stitches.Page.$droplabel.fadeOut("fast");
				}

                var reader = new FileReader();
                reader.onloadend = Stitches.Page.handleFileLoad.bind(file);
                reader.readAsDataURL(file);
            },

            handleFileLoad: function (evt) {
            	Stitches.filesQueue--;

                var callback = function () {
                    var icon = new Stitches.Icon(this.name, evt.target.result);
                    var $li = $( $.tmpl("icon_tmpl", icon) ).data("icon", icon);
                    Stitches.Page.$filelist.append($li);
                    $li.fadeIn("fast");

                    if (Stitches.filesQueue === 0) {
                        Stitches.Page.toggleButtons("remove", ["generate", "clear"]);
                    }
                }

                if (!Stitches.Page.hasTemplates) {
                    Stitches.Page.getTemplates(callback.bind(this));
                } else {
                    callback.call(this);
                }
            },

            removeFile: function (evt) {
                Stitches.Page.toggleButtons("add", ["sprite", "stylesheet"]);

                $(this).parent().fadeOut("fast", function () {
                    $(this).remove();
                });

                Stitches.filesCount--;
                if (Stitches.filesCount === 0) {
                    Stitches.Page.toggleButtons("add", ["generate", "clear"]);
                    Stitches.Page.$droplabel.fadeIn("fast");
                }

                return false;
            },

            clearFiles: function () {
                Stitches.Page.$filelist.find("a.remove").each(function () {
                    Stitches.Page.removeFile.bind(this)();
                });
            }
        };
    })();

})(window, Stitches, jQuery);