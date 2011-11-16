/*!
 * Stitches.Page
 * http://draeton.github.com/Stitches
 *
 * Copyright 2011, Matthew Cobbs
 * Licensed under the MIT license.
 */
/*global jQuery, Stitches */
(function (window, Stitches, $) {

    "use strict";

    // Simple JavaScript Templating
    // John Resig - http://ejohn.org/ - MIT Licensed
    (function () {
        var cache = {};

        Stitches.tmpl = function tmpl(str, data) {
            // Figure out if we're getting a template, or if we need to
            // load the template - and be sure to cache the result.
            var fn = !/\W/.test(str) ? cache[str] = cache[str] || tmpl(document.getElementById(str).innerHTML) :

            // Generate a reusable function that will serve as a template
            // generator (and which will be cached).
            new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};" +

            // Introduce the data as local variables using with(){}
            "with(obj){p.push('" +

            // Convert the template into pure JavaScript
            str.replace(/[\r\t\n]/g, " ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'") + "');}return p.join('');");

            // Provide some basic currying to the user
            return data ? fn(data) : fn;
        };
    })();

    Stitches.Page = (function () {
        return {
            init: function ($elem) {
                if (!$elem) {
                    $elem = $('<div>').appendTo('body');
                }
                Stitches.Page.$elem = $elem;

                // test
                console.log("drag", $elem.get(0).ondragover);
                console.log("file", FileReader);

                // load templates
                Stitches.Page.getTemplates();
            },

            getTemplates: function () {
                $.get("js/stitches/templates.html", function (html) {
                    $("body").append(html);
                    
                    Stitches.Page.templates = {
                        stitches: Stitches.tmpl("stitches_tmpl"),
                        icon: Stitches.tmpl("stitches_icon_tmpl")
                    };

                    var $div = $(Stitches.Page.templates.stitches({}));
                    $div.appendTo(Stitches.Page.$elem);

                    // set dom element references
                    Stitches.Page.setReferences();
                });
            },

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

                // bind handlers to generated element
                Stitches.Page.bindHandlers();
            },

            bindHandlers: function () {
                Stitches.Page.$dropbox.each(function () {
                    this.addEventListener("dragenter", function () {
                            Stitches.Page.$dropbox.addClass("dropping")
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

            handleButtons: function (evt) {
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

            setButtonDisabled: function (disabled, buttons) {
                var action = disabled ? "add" : "remove";

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

                Stitches.Page.setButtonDisabled(true, ["generate", "clear", "sprite", "stylesheet"]);

                if (Stitches.filesCount === 1) {
                    Stitches.Page.$droplabel.fadeOut("fast");
                }

                var reader = new FileReader();
                reader.onloadend = Stitches.Page.handleFileLoad.bind(file);
                reader.readAsDataURL(file);
            },

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

            clearFiles: function () {
                Stitches.Page.$filelist.find("a.remove").each(function () {
                    Stitches.Page.removeFile.bind(this)();
                });
            }
        };
    })();

})(window, Stitches, jQuery);