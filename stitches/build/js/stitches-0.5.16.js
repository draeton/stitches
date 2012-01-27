// ## Stitches - HTML5 Sprite Sheet Generator
//
// [http://draeton.github.com/stitches](http://draeton.github.com/stitches)
//
// Copyright 2011, Matthew Cobbs
// Licensed under the MIT license.
//
/*global jQuery, Stitches, Modernizr */
(function (window, $, Modernizr) {

    "use strict";

    // ## Stitches namespace
    //
    // Holds all methods
    var S = window.Stitches = (function () {

        /* Some configuration defaults */
        var defaults = {
            "jsdir": "js",
            "prefix": "sprite",
            "padding": 10,
            "dataURI": false
        };

        /* Pub/sub subscription manager */
        var _topics = {};

        return {
            // ### init
            //
            // Readies everything for user interaction.
            //
            //     @param {jQuery} $elem A wrapped DOM node
            //     @param {Object} config An optional settings object
            init: function ($elem, config) {
                S.settings = $.extend({}, defaults, config);
                S.iconQueue = [];
                S.Page.$elem = $elem;

                /* setup subscriptions */
                S.sub("page.error",          S.Page.errorHandler);
                S.sub("page.init.done",      S.Page.fetchTemplates);
                S.sub("page.templates.done", S.Page.render);
                S.sub("page.render.done",    S.checkAPIs);
                S.sub("page.apis.done",      S.Page.bindDragAndDrop);
                S.sub("page.apis.done",      S.Page.bindButtons);
                S.sub("page.apis.done",      S.Page.bindCabinet);
                S.sub("page.apis.done",      S.Page.bindOptions);
                S.sub("page.apis.done",      S.Page.subscribe);
                S.sub("page.drop.done",      S.File.queueFiles);
                S.sub("file.queue.done",     S.File.queueIcons);
                S.sub("file.icon.done",      S.Page.addIcon);
                S.sub("file.remove.done",    S.Page.removeIcon);
                S.sub("file.unqueue",        S.File.unqueueIcon);
                S.sub("file.unqueue.all",    S.File.unqueueAllIcons);
                S.sub("sprite.generate",     S.generateStitches);

                /* notify */
                S.pub("page.init.done");
            },

            // ### sub
            //
            // Subscribe to a topic
            //
            //     @param {String} topic The subscription topic name
            //     @param {Function} fn A callback to fire
            sub: function (topic, fn) {
                var callbacks = _topics[topic] ||  $.Callbacks("stopOnFalse");
                if (fn) {
                    callbacks.add(fn);
                }
                _topics[topic] = callbacks;
            },

            // ### unsub
            //
            // Unsubscribe from a topic
            //
            //     @param {String} topic The subscription topic name
            //     @param {Function} fn A callback to remove
            unsub: function (topic, fn) {
                var callbacks = _topics[topic];
                if (callbacks) {
                    callbacks.remove(fn);
                }
            },

            // ### pub
            //
            // Publish a topic
            //
            //     @param {String} topic The subscription topic name
            pub: function (topic) {
                var callbacks = _topics[topic],
                    args = Array.prototype.slice.call(arguments, 1);
                if (callbacks) {
                    callbacks.fire.apply(callbacks, args);
                }
            },

            // ### checkAPIs
            //
            // Load supporting libraries for browsers with no native support. Uses
            // Modernizr to check for drag-and-drop, FileReader, and canvas
            // functionality.
            checkAPIs: function () {
                Modernizr.load([
                    {
                        test: typeof FileReader !== "undefined" && Modernizr.draganddrop,
                        nope: S.settings.jsdir + "/dropfile/dropfile.js"
                    },
                    {
                        test: Modernizr.canvas,
                        nope: S.settings.jsdir + "/flashcanvas/flashcanvas.js",
                        complete: function () {
                            if (typeof FileReader !== "undefined" && Modernizr.draganddrop && Modernizr.canvas) {
                                S.pub("page.apis.done");
                            } else {
                                S.pub("page.error", new Error("Required APIs are not present."));
                            }
                        }
                    }
                ]);
            },

            // ### generateStitches
            //
            // Positions all of the icons from the $filelist on the canvas;
            // crate the sprite link and the stylesheet link;
            // updates button state
            //
            //     @param {[Icon]} looseIcons An Icon array of images to place
            generateStitches: function (looseIcons) {
                var placedIcons = S.positionImages(looseIcons);
                var sprite = S.makeStitches(placedIcons);
                var stylesheet = S.makeStylesheet(placedIcons, sprite);

                /* notify */
                S.pub("sprite.generate.done", sprite, stylesheet);
            },

            // ### positionImages
            //
            // Position all of the images in the `looseIcons` array within the canvas
            //
            //     @param {[Icon]} looseIcons An Icon array of images to place
            //     @return {[Icon]} The placed images array
            positionImages: function (looseIcons) {
                var placedIcons = [];

            	/* reset position of icons */
            	$(looseIcons).each(function (idx, icon) {
            		icon.x = icon.y = 0;
            		icon.isPlaced = false;
            	});

                /* reverse sort by area */
                looseIcons = looseIcons.sort(function (a, b) {
                    if (b.area === a.area) {
                        return b.name > a.name ? 1 : -1;
                    } else {
                        return b.area - a.area;
                    }
                });

                /* find the ideal sprite for this set of icons */
                S.canvas = S.Icons.idealCanvas(looseIcons);

                /* try to place all of the icons on the ideal canvas */
                S.Icons.placeIcons(looseIcons, placedIcons, S.canvas);

                /* trim empty edges */
                S.Icons.cropCanvas(placedIcons, S.canvas);

                /* notify  and return */
                S.pub("sprite.position.done", placedIcons);
                return placedIcons;
            },

            // ### makeStitches
            //
            // Draw images on canvas
            //
            //     @param {[Icon]} The placed images array
            //     @return {String} The sprite image data URL
            makeStitches: function (placedIcons) {
                var context, data;

                /* this block often fails as a result of the cross-
                   domain blocking in browses for access to write
                   image data to the canvas */
                try {
                    context = S.canvas.getContext('2d');
                    $(placedIcons).each(function (idx, icon) {
                        context.drawImage(icon.image, icon.x, icon.y);
                    });

                    /* create image link */
                    data = S.canvas.toDataURL();
                } catch (e) {
                    S.pub("page.error", e);
                }

                /* notify  and return */
                S.pub("sprite.image.done", data);
                return data;
            },

            // ### makeStylesheet
            //
            // Create stylesheet text
            //
            //     @param {[Icon]} The placed images array
            //     @param {String} The sprite data URI string
            //     @return {String} The sprite stylesheet
            makeStylesheet: function (placedIcons, sprite) {
                /* sort by name for css output */
                placedIcons = placedIcons.sort(function (a, b) {
                    return a.name < b.name ? -1 : 1;
                });

                var prefix = S.settings.prefix;

                var backgroundImage
                if (S.settings.dataURI) {
                    backgroundImage = sprite;
                } else {
                    backgroundImage = "download.png";
                }

                var css = [
                    "." + prefix + " {",
                    "    background: url(" + backgroundImage + ") no-repeat;",
                    "}\n"
                ];

                $(placedIcons).each(function (idx, icon) {
                    css = css.concat([
                        "." + prefix + "-" + icon.name + " {",
                        "    width: " + icon.image.width + "px;",
                        "    height: " + icon.image.height + "px;",
                        "    background-position: -" + icon.x + "px -" + icon.y + "px;",
                        "}\n"
                    ]);
                });

                /* create stylesheet link */
                var data = "data:," + encodeURIComponent(css.join("\n"));

                /* notify  and return */
                S.pub("sprite.stylesheet.done", data);
                return data;
            }
        };
    })();

})(window, jQuery, Modernizr);// ## Stitches.Icons
//
// [http://draeton.github.com/stitches](http://draeton.github.com/stitches)
//
// Copyright 2011, Matthew Cobbs
// Licensed under the MIT license.
//
/*global jQuery, Stitches */
(function (window, Stitches, $) {

    "use strict";

    // ## Stitches.Icons namespace
    //
    // Holds all methods for working with icons
    Stitches.Icons = (function () {

        /* shortcut */
        var S = window.Stitches;

        /* shortcut */
        var document = window.document;

        return {
            // ### idealCanvas
            //
            // Find the ideal sprite canvas
            //
            //     @param {Array} icons A list of icons
            //     @return {HTMLCanvasElement}
            idealCanvas: function (icons) {
                var maxW = 0;
                var maxH = 0;
                var area = 0;

                /* find the max height & width; the area is the sum of the areas
                   of the rectangles */
                $(icons).each(function (idx, icon) {
                    maxW = icon.width > maxW ? icon.width : maxW;
                    maxH = icon.height > maxH ? icon.height : maxH;
                    area += icon.area;
                });

                /* ideal shape is a square, with sides the length of the square root of
                   the area */
                var ideal = Math.ceil(Math.sqrt(area));

                /* if there is a rectangle with a width or height greater than the square
                   root, increase the length of that side of the ideal square....
                   which I guess makes it an ideal rectangle */
                var idealW = maxW > ideal ? maxW : ideal;
                var idealH = maxH > ideal ? maxH : ideal;

                /* create the sprite canvas */
                var canvas = document.createElement("canvas");
                canvas.width = idealW;
                canvas.height = idealH;

                return canvas;
            },

            // ### placeIcons
            //
            // Place icons within the sprite (the ideal square)
            //
            //     @param {Array} loose All loose icons
            //     @param {Array} placed All placed icons
            //     @param {HTMLCanvasElement} canvas The working canvas
            //     @return {Boolean} Have all icons been placed?
            placeIcons: function (loose, placed, canvas) {
                var i = 0;

                /* loop through all of the icons, attempting to place them within the sprite
                   without intersections */
                while (loose.length && i < 10) {
                    $(loose).each(function (idx, icon) {
                        if (!icon.isPlaced) {
                            icon.isPlaced = S.Icons.placeIcon(icon, placed, canvas);
                        }
                    });

                    i++;
                }

                for (i = 0; i < loose.length; i++) {
                    if (loose[i].isPlaced) {
                        loose.splice(i);
                    }
                }

                /* done */
                return true;
            },

            // ### placeIcon
            //
            // Place one icon on the sprite, checking for intersects with the sprite
            // dimensions and other placed icons
            //
            //     @param {Icon} icon The icon to place
            //     @param {Array} placed All placed icons
            //     @param {HTMLCanvasElement} canvas The working canvas
            //     @return {Boolean} Have this icon been placed?
            placeIcon: function (icon, placed, canvas) {
                var i = 0;

                /* two tries to place the icon... */
                while (i < 2) {
                    for (var y = 0; y <= canvas.height - icon.height; y++) {
                        for (var x = 0; x <= canvas.width - icon.width; x++) {
                            icon.x = x;
                            icon.y = y;

                            var overlap = S.Icons.isOverlapped(icon, placed);
                            if (!overlap) {
                                return true;
                            }

                            x = overlap.x + overlap.width;
                        }

                        y = overlap.y + overlap.height;
                    }

                    /* no room, so add the width of the icon */
                    canvas.width += icon.width;
                    canvas.height += icon.height;
                    i++;
                }

                /* if we made it here, place was unsuccessful */
                return false;
            },

            // ### isOverlapped
            //
            // Check if this icon overlaps any of the placed icons. If not,
            // add to the `placed` array
            //
            //     @param {Icon} icon The icon to place
            //     @param {Array} placed All placed icons
            //     @return {Null|Object} Overlap coordinates, if overlap
            isOverlapped: function (icon, placed) {
                var x1, x2, y1, y2;
                var intersect = [];
                var overlap = null;

                /* filter the checkPoints arrays based on currentIcon position */
                $(placed).each(function (idx, p) {
                    x1 = (p.x < icon.x + icon.width);
                    x2 = (p.x + p.width > icon.x);
                    y1 = (p.y < icon.y + icon.height);
                    y2 = (p.y + p.height > icon.y);

                    if (x1 && x2 && y1 && y2) {
                        intersect.push(p);
                    }
                });

                /* if there are any items left in the intersect array, there has been an overlap */
                if (intersect.length) {
                    overlap = intersect.pop();
                } else {
                    placed.push(icon);
                }

                return overlap;
            },

            // ### cropCanvas
            //
            // Crop to content, after placing icons
            //
            //     @param {Array} placed All placed icons
            //     @param {HTMLCanvasElement} canvas The working canvas
            cropCanvas: function (placed, canvas) {
                var w = 0, h = 0;

                $(placed).each(function (idx, icon) {
                    w = w > icon.x + icon.width ? w : icon.x + icon.width;
                    h = h > icon.y + icon.height ? h : icon.y + icon.height;
                });

                canvas.width = w;
                canvas.height = h;
            }
        };
    })();

})(window, Stitches, jQuery);// ## Stitches.Icon
//
// [http://draeton.github.com/stitches](http://draeton.github.com/stitches)
//
// Copyright 2011, Matthew Cobbs
// Licensed under the MIT license.
//
/*global jQuery, Stitches */
(function (window, Stitches) {

    "use strict";

    // ## Stitches.Icon namespace
    //
    // Constructs and manages icons
    Stitches.Icon = (function () {

        /* shortcut */
        var S = window.Stitches;

        /* Maintain a unique id for each icon */
        var guid = 0;

        /* Maintains a unique name for each icon */
        var nameCache = {};

        // ### Icon
        //
        // Wraps a single icon. Creates a new image from the source
        // and sets additional properties after the image loads.
        // The callback is generally used to handle queueuing
        //
        //     @param {String} name
        //     @param {String} src
        //     @param {Function} cb Optional callback
        //     @constructor
        var Icon = function (name, src, cb) {
            var self = this;

            this.guid = guid++;
            this.name = S.Icon.getName(name);

            this.image = new Image();
            this.image.onload = function () {
                self.x = 0;
                self.y = 0;
                self.width = self.image.width + S.settings.padding;
                self.height = self.image.height + S.settings.padding;
                self.area = self.width * self.height;

                if (cb) {
                    cb(self);
                }
            }
            this.image.src = src;
        };

        // ### Icon.getName
        //
        // Return a unique name. If the name is already in the nameCache,
        // append a value until a unique name is found.
        //
        //     @param {String} name
        //     @return {String}
        Icon.getName = function (name) {
            var i = 1, fix;

            name = name.replace(/[\s.]+/gi, "-").replace(/[^a-z0-9\-]/gi, "_");

            if (nameCache[name]) {
                do {
                    fix = name + "-" + i++;
                } while (nameCache[fix]);
                name = fix;
            }

            nameCache[name] = true;
            return name;
        };

        // ### Icon.clearNameCache
        //
        // Clear the name cache. If a name is passed in, only clear that key
        //
        //     @param {String} name
        //     @return {String}
        Icon.clearNameCache = function (name) {
            if (name) {
                delete nameCache[name];
            } else {
                nameCache = {};
            }
        };

        /* return constructor */
        return Icon;
    })();

})(window, Stitches);/* Simple JavaScript Templating
   John Resig - http://ejohn.org/ - MIT Licensed */
(function () {
    var cache = {};

    Stitches.tmpl = function tmpl(str, data) {
        /* Figure out if we're getting a template, or if we need to
           load the template - and be sure to cache the result. */
        var fn = !/\W/.test(str) ? cache[str] = cache[str] || tmpl(document.getElementById(str).innerHTML) :

        /* Generate a reusable function that will serve as a template
           generator (and which will be cached). */
        new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};" +

        /* Introduce the data as local variables using with(){} */
        "with(obj){p.push('" +

        /* Convert the template into pure JavaScript */
        str.replace(/[\r\t\n]/g, " ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'") + "');}return p.join('');");

        /* Provide some basic currying to the user */
        return data ? fn(data) : fn;
    };
})();// ## Stitches.Page
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

})(window, Stitches, jQuery);// ## Stitches.File
//
// [http://draeton.github.com/stitches](http://draeton.github.com/stitches)
//
// Copyright 2011, Matthew Cobbs
// Licensed under the MIT license.
//
/*global jQuery, Stitches */
(function (window, Stitches, $) {

    "use strict";

    // ## Stitches.File namespace
    //
    // Holds all File procesing methods
    Stitches.File = (function () {

        /* shortcut */
        var S = window.Stitches;

        /* track files to read */
        var readQueue = [];

        return {
            // ### queueFiles
            //
            // Loops through `files`; adds an image to the `readQueue`
            //
            //     @param {FileList} files From a drop event
            queueFiles: function (files) {
                $.each(files, function (i, file) {
                    if (/jpeg|png|gif/.test(file.type)) {
                        readQueue.push(file);
                        S.pub("file.queue.done", file);
                    }
                });
            },

            // ### queueIcons
            //
            // Read in a file from the `readQueue`. Starts up a new `FileReader`
            // to read in the image as data and create a new `Icon`
            queueIcons: function () {
                var file, reader;

                file = readQueue.shift();
                if (file) {
                    try {
                        reader = new FileReader();
                        reader.onloadend = function (e) {
                            /* create an icon and add to the icon queue */
                            var icon = new S.Icon(file.name, e.target.result);
                            S.iconQueue.push(icon);

                            /* notify */
                            S.pub("file.icon.done", icon);
                        };
                        reader.readAsDataURL(file);
                    } catch (e) {
                        S.pub("page.error", e);
                    }
                }
            },

            // ### unqueueIcon
            //
            // Removes an icon from the queue
            //
            //     @param {Icon} icon
            unqueueIcon: function (icon) {
                /* remove the icon from the queue */
                S.iconQueue = $.grep(S.iconQueue, function (item) {
                    return item !== icon;
                });
                S.Icon.clearNameCache(icon.name);

                /* notify */
                S.pub("file.remove.done", icon);
            },

            // ### unqueueAllIcons
            //
            // Clear all icons from the queue
            unqueueAllIcons: function () {
                $.each(S.iconQueue, function (i, icon) {
                    S.File.unqueueIcon(icon);
                });
                S.Icon.clearNameCache();
            }
        };
    })();

})(window, Stitches, jQuery);