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
                
                Stitches.Page.templates = {
                	loaded: false
                };
				Stitches.Page.getTemplates();
				
                Stitches.Page.bindHandlers();
            },
            
            getTemplates: function (callback) {
            	$.get("templates.html", function (html) {
            		$("body").append(html);
            		Stitches.Page.templates.stitches = Stitches.tmpl("stitches_tmpl");
            		Stitches.Page.templates.icon = Stitches.tmpl("stitches_icon_tmpl");
            		Stitches.Page.templates.loaded = true;
            		
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
                    var $li = $( Stitches.tmpl(Stitches.Page.templates.icon, icon) ).data("icon", icon);
                    Stitches.Page.$filelist.append($li);
                    $li.fadeIn("fast");

                    if (Stitches.filesQueue === 0) {
                        Stitches.Page.toggleButtons("remove", ["generate", "clear"]);
                    }
                }

                if (!Stitches.Page.templates.loaded) {
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