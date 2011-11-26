/*!
 * Stitches - HTML5 Sprite Generator
 * http://draeton.github.com/stitches
 *
 * Copyright 2011, Matthew Cobbs
 * Licensed under the MIT license.
 */
/*global jQuery, Stitches, Modernizr */
(function (window, $, Modernizr) {

    "use strict";

    window.Stitches = (function () {
        var defaults = {
            "jsdir": "js"
        };
        
        return {
            init: function ($elem, config) {
                Stitches.settings = $.extend({}, defaults, config);
                
                var jsdir = Stitches.settings.jsdir;
                
                Modernizr.load([
                    {
                        test: typeof FileReader !== "undefined" && Modernizr.draganddrop,
                        nope: jsdir + "/dropfile/dropfile.js"
                    },
                    {
                        test: Modernizr.canvas,
                        nope: jsdir + "/flashcanvas/flashcanvas.js",
                        complete: function () {
                            Stitches.filesCount = 0;
                            Stitches.Page.init($elem);
                        }
                    }
                ]);
            },

            generateStitches: function () {
            	Stitches.looseIcons = [];
            	Stitches.placedIcons = [];

            	Stitches.Page.$filelist.find("li").each(function () {
            		var icon = $(this).data("icon");
            		Stitches.looseIcons.push(icon);
            	});

                Stitches.positionImages();
                var sprite = Stitches.makeStitches();
                var stylesheet = Stitches.makeStylesheet();

                Stitches.Page.buttons.$sprite.attr("href", sprite);
                Stitches.Page.buttons.$stylesheet.attr("href", stylesheet);
                Stitches.Page.setButtonDisabled(false, ["sprite", "stylesheet"]);
            },

            positionImages: function () {
            	// reset position of icons
            	Stitches.looseIcons.forEach(function (icon, idx) {
            		icon.x = icon.y = 0;
            		icon.isPlaced = false;
            	});

                // reverse sort by area
                Stitches.looseIcons = Stitches.looseIcons.sort(function (a, b) {
                    return b.area - a.area;
                });

                // find the ideal sprite for this set of icons
                Stitches.canvas = Stitches.Icons.idealCanvas(Stitches.looseIcons);

                // try to place all of the icons on the ideal canvas
                Stitches.Icons.placeIcons(Stitches.looseIcons, Stitches.placedIcons, Stitches.canvas);

                // trim empty edges
                Stitches.Icons.cropCanvas(Stitches.placedIcons, Stitches.canvas);
            },

            // draw images on canvas
            makeStitches: function () {
                var context = Stitches.canvas.getContext('2d');
                Stitches.placedIcons.forEach(function (icon, idx) {
                    context.drawImage(icon.image, icon.x, icon.y);
                });

                // add save link
                return Stitches.canvas.toDataURL();
            },

            // create stylesheet text
            makeStylesheet: function () {
                // sort by name for css output
                Stitches.placedIcons = Stitches.placedIcons.sort(function (a, b) {
                    return a.name < b.name ? -1 : 1;
                });

                var text = "";
                text += ".sprite {\n";
                text += "    background: url(sprite.png) no-repeat;\n";
                text += "}\n\n";

                Stitches.placedIcons.forEach(function (icon, idx) {
                    text += ".sprite-" + icon.name + " {\n";
                    text += "    width: " + icon.width + "px;\n";
                    text += "    height: " + icon.height + "px;\n";
                    text += "    background-position: -" + icon.x + "px -" + icon.y + "px;\n";
                    text += "}\n\n";
                });

                // add save link
                return "data:," + encodeURIComponent(text);
            }
        };
    })();

})(window, jQuery, Modernizr);/*!
 * Stitches.Icons
 * http://draeton.github.com/stitches
 *
 * Copyright 2011, Matthew Cobbs
 * Licensed under the MIT license.
 */
/*global jQuery, Stitches */
(function (window, Stitches) {

    "use strict";

    var document = window.document;

    Stitches.Icons = (function () {
        return {
            // find the ideal sprite canvas
            idealCanvas: function (icons) {
                var maxW = 0;
                var maxH = 0;
                var area = 0;

                // find the max height & width; the area is the sum of the areas
                // of the rectangles
                icons.forEach(function (icon, idx) {
                    maxW = icon.width > maxW ? icon.width : maxW;
                    maxH = icon.height > maxH ? icon.height : maxH;
                    area += icon.area;
                });

                // ideal shape is a square, with sides the length of the square root of
                // the area
                var ideal = Math.ceil(Math.sqrt(area));

                // if there is a rectangle with a width or height greater than the square
                // root, increase the length of that side of the ideal square....
                // which I guess makes it an ideal rectangle
                var idealW = maxW > ideal ? maxW : ideal;
                var idealH = maxH > ideal ? maxH : ideal;

                // create the sprite canvas
                var canvas = document.createElement("canvas");
                canvas.width = idealW;
                canvas.height = idealH;

                // return it
                return canvas;
            },

            // place icons within the sprite (the ideal square)
            placeIcons: function (loose, placed, canvas) {
                var i = 0;

                // loop through all of the icons, attempting to place them within the sprite
                // without intersections
                while (loose.length && i < 10) {
                    loose.forEach(function (icon, idx) {
                        if (!icon.isPlaced) {
                            icon.isPlaced = Stitches.Icons.placeIcon(icon, placed, canvas);
                        }
                    });

                    i++;
                }

                for (i = 0; i < loose.length; i++) {
                    if (loose[i].isPlaced) {
                        loose.splice(i);
                    }
                }

                // done
                return true;
            },

            // place one icon on the sprite, checking for intersects with the sprite
            // dimensions and other placed icons
            placeIcon: function (icon, placed, canvas) {
                var i = 0;

                // two tries to place the icon...
                while (i < 2) {
                    for (var y = 0; y <= canvas.height - icon.height; y++) {
                        for (var x = 0; x <= canvas.width - icon.width; x++) {
                            icon.x = x;
                            icon.y = y;

                            var overlap = Stitches.Icons.isOverlapped(icon, placed);
                            if (!overlap) {
                                return true;
                            }

                            x = overlap.x + overlap.width;
                        }

                        y = overlap.y + overlap.height;
                    }

                    // no room, so add the width of the icon
                    canvas.width += icon.width;
                    canvas.height += icon.height;
                    i++;
                }

                // if we made it here, place was unsuccessful
                return false;
            },

            // check if this icon overlaps any of the placed icons
            isOverlapped: function (icon, placed) {
                var x1, x2, y1, y2;
                var intersect = [];
                var overlap = null;

                // filter the checkPoints arrays based on currentIcon position
                placed.forEach(function (p, idx) {
                    x1 = (p.x < icon.x + icon.width);
                    x2 = (p.x + p.width > icon.x);
                    y1 = (p.y < icon.y + icon.height);
                    y2 = (p.y + p.height > icon.y);

                    if (x1 && x2 && y1 && y2) {
                        intersect.push(p);
                    }
                });

                // if there are any items left in the intersect array, there has been an overlap
                if (intersect.length) {
                    overlap = intersect.pop();
                } else {
                    placed.push(icon);
                }

                return overlap;
            },

            // crop to content
            cropCanvas: function (placed, canvas) {
                var w = 0, h = 0;

                placed.forEach(function (icon, idx) {
                    w = w > icon.x + icon.width ? w : icon.x + icon.width;
                    h = h > icon.y + icon.height ? h : icon.y + icon.height;
                });

                canvas.width = w;
                canvas.height = h;
            }
        };
    })();

})(window, Stitches);/*!
 * Stitches.Icon
 * http://draeton.github.com/stitches
 *
 * Copyright 2011, Matthew Cobbs
 * Licensed under the MIT license.
 */
/*global jQuery, Stitches */
(function (window, Stitches) {

    "use strict";

    var guid = 0;

    // Icon image class
    Stitches.Icon = function (name, src, cb) {
        var self = this;

        this.guid = guid++;
        this.name = name.replace(/\.|\s+/gi, "-");

        this.image = new Image();
        this.image.onload = function () {
            self.x = 0;
            self.y = 0;
            self.width = self.image.width;
            self.height = self.image.height;
            self.area = self.width * self.height;

            if (cb) {
                cb(self);
            }
        }
        this.image.src = src;
    };

})(window, Stitches);/*!
 * Stitches.Page
 * http://draeton.github.com/stitches
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
                if (typeof FileReader !== "undefined" && Modernizr.draganddrop) {
                    // load templates
                    Stitches.Page.getTemplates();
                } else {
                    // browser is not compatible
                }
            },

            getTemplates: function () {
                var jsdir = Stitches.settings.jsdir;
                
                $.get(jsdir + "/stitches.html", function (html) {
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

                Stitches.Page.$dropbox.removeClass("dropping");

                var e = evt || window.event;
                var files = (e.files || e.dataTransfer.files);

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