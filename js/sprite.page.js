/*!
 * HTML5 Sprite Generator
 * http://www.matthewcobbs.com/sandbox/html5sprite/
 *
 * Copyright 2011, Matthew Cobbs
 * Licensed under the MIT license.
 */
(function (window, Sprite, $) {

    var document = window.document;

    Sprite.Page = (function () {
        return {
            init: function () {
                Sprite.Page.dropbox = $("#dropbox").get(0);
                Sprite.Page.$droplabel = $("#droplabel");
                Sprite.Page.$filelist = $("#filelist");
                Sprite.Page.$buttons = $("#buttons");
                Sprite.Page.buttons =  {
                	$generate: $("a.generate"),
                	$clear: $("a.clear"),
                	$sprite: $("a.sprite"),
                	$stylesheet: $("a.stylesheet")
                };
                
                Sprite.Page.bindHandlers();
            },
            
            bindHandlers: function () {
                Sprite.Page.dropbox.addEventListener("dragenter", Sprite.Page.noopHandler, false);
                Sprite.Page.dropbox.addEventListener("dragexit", Sprite.Page.noopHandler, false);
                Sprite.Page.dropbox.addEventListener("dragover", Sprite.Page.noopHandler, false);
                Sprite.Page.dropbox.addEventListener("drop", Sprite.Page.drop, false);
            	
            	Sprite.Page.$buttons.delegate("a", "click", Sprite.Page.handleButtons);
            	
            	Sprite.Page.$filelist.delegate("a.remove", "click", Sprite.Page.removeFile);
            },

            handleButtons: function (evt) {
                if (/disabled/.test(this.className)) {
                    return false;
                }

                if (/generate/.test(this.className)) {
                    Sprite.Page.toggleButtons("add", ["generate", "clear"]);
                    Sprite.generateSprite();
                    Sprite.Page.toggleButtons("remove", ["generate", "clear"]);
                    return false;
                }

                if (/clear/.test(this.className)) {
                    Sprite.Page.clearFiles();
                    return false;
                }

                return true;
            },

            toggleButtons: function (action, buttons) {
                buttons.forEach(function (val, idx) {
                    Sprite.Page.buttons["$" + val][action + "Class"]("disabled");
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
                    Sprite.Page.handleFiles(files);
                }
            },

            handleFiles: function (files) {
                Sprite.filesQueue = 0;

                for (var i = 0, l = files.length; i < l; i++) {
                    var file = files[i];

                    if (/jpeg|png|gif/.test(file.type)) {
                    	Sprite.Page.addFile(file);
                    }
                }
            },
            
            addFile: function (file) {
            	Sprite.filesCount++;
            	Sprite.filesQueue++;

                Sprite.Page.toggleButtons("add", ["generate", "clear", "sprite", "stylesheet"]);
            	
            	if (Sprite.filesCount === 1) {
                    Sprite.Page.$droplabel.fadeOut("fast");
				}
                        
                var reader = new FileReader();
                reader.onloadend = Sprite.Page.handleFileLoad.bind(file);
                reader.readAsDataURL(file);
            },
            
            handleFileLoad: function (evt) {
            	Sprite.filesQueue--;
            	
            	var icon = new Sprite.Icon(this.name, evt.target.result);
            	var $li = $( $.tmpl("icon_tmpl", icon) ).data("icon", icon);            	
            	Sprite.Page.$filelist.append($li);
                $li.fadeIn("fast")
            	
            	if (Sprite.filesQueue === 0) {
                    Sprite.Page.toggleButtons("remove", ["generate", "clear"]);
            	}
            },

            removeFile: function (evt) {
                Sprite.Page.toggleButtons("add", ["sprite", "stylesheet"]);

                $(this).parent().fadeOut("fast", function () {
                    $(this).remove();
                });

                Sprite.filesCount--;
                if (Sprite.filesCount === 0) {
                    Sprite.Page.toggleButtons("add", ["generate", "clear"]);
                    Sprite.Page.$droplabel.fadeIn("fast");
                }

                return false;
            },

            clearFiles: function () {
                Sprite.Page.$filelist.find("a.remove").each(function () {
                    Sprite.Page.removeFile.bind(this)();
                });
            }
        };
    })();

})(this, Sprite, jQuery);