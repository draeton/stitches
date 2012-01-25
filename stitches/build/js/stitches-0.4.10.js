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
    window.Stitches = (function () {
        // **Some configuration defaults**
        var defaults = {
            "jsdir": "js",
            "prefix": "sprite",
            "padding": 10,
            "dataURI": false
        };

        return {
            // **Pub/sub subscription manager**
            _topics: {},

            // ### init
            //
            // Readies everything for user interaction.
            //
            //     @param {jQuery} $elem A wrapped DOM node
            //     @param {Object} config An optional settings object
            init: function ($elem, config) {
                Stitches.settings = $.extend({}, defaults, config);
                Stitches.iconQueue = [];
                Stitches.Page.$elem = $elem;

                /* setup subscriptions */
                Stitches.sub("page.error",          Stitches.Page.errorHandler);
                Stitches.sub("page.init.done",      Stitches.Page.fetchTemplates);
                Stitches.sub("page.templates.done", Stitches.Page.render);
                Stitches.sub("page.render.done",    Stitches.checkAPIs);
                Stitches.sub("page.apis.done",      Stitches.Page.bindDragAndDrop);
                Stitches.sub("page.apis.done",      Stitches.Page.bindButtons);
                Stitches.sub("page.apis.done",      Stitches.Page.bindFileInput);
                Stitches.sub("page.apis.done",      Stitches.Page.subscribe);
                Stitches.sub("page.drop.done",      Stitches.File.queueFiles);
                Stitches.sub("file.queue.done",     Stitches.File.queueIcons);
                Stitches.sub("file.icon.done",      Stitches.Page.addIcon);
                Stitches.sub("file.remove.done",    Stitches.Page.removeIcon);
                Stitches.sub("file.unqueue",        Stitches.File.unqueueIcon);
                Stitches.sub("file.unqueue.all",    Stitches.File.unqueueAllIcons);
                Stitches.sub("sprite.generate",     Stitches.generateStitches);

                /* notify */
                Stitches.pub("page.init.done");
            },

            // ### sub
            //
            // Subscribe to a topic
            //
            //     @param {String} topic The subscription topic name
            //     @param {Function} fn A callback to fire
            sub: function (topic, fn) {
                var callbacks = Stitches._topics[topic] ||  $.Callbacks("stopOnFalse");
                if (fn) {
                    callbacks.add(fn);
                }
                Stitches._topics[topic] = callbacks;
            },

            // ### unsub
            //
            // Unsubscribe from a topic
            //
            //     @param {String} topic The subscription topic name
            //     @param {Function} fn A callback to remove
            unsub: function (topic, fn) {
                var callbacks = Stitches._topics[topic];
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
                var callbacks = Stitches._topics[topic],
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
                        nope: Stitches.settings.jsdir + "/dropfile/dropfile.js"
                    },
                    {
                        test: Modernizr.canvas,
                        nope: Stitches.settings.jsdir + "/flashcanvas/flashcanvas.js",
                        complete: function () {
                            if (typeof FileReader !== "undefined" && Modernizr.draganddrop && Modernizr.canvas) {
                                Stitches.pub("page.apis.done");
                            } else {
                                Stitches.pub("page.error", new Error("Required APIs are not present."));
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
                var placedIcons = Stitches.positionImages(looseIcons);
                var sprite = Stitches.makeStitches(placedIcons);
                var stylesheet = Stitches.makeStylesheet(placedIcons, sprite);

                /* notify */
                Stitches.pub("sprite.generate.done", sprite, stylesheet);
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
                Stitches.canvas = Stitches.Icons.idealCanvas(looseIcons);

                /* try to place all of the icons on the ideal canvas */
                Stitches.Icons.placeIcons(looseIcons, placedIcons, Stitches.canvas);

                /* trim empty edges */
                Stitches.Icons.cropCanvas(placedIcons, Stitches.canvas);

                /* notify  and return */
                Stitches.pub("sprite.position.done", placedIcons);
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
                    context = Stitches.canvas.getContext('2d');
                    $(placedIcons).each(function (idx, icon) {
                        context.drawImage(icon.image, icon.x, icon.y);
                    });

                    /* create image link */
                    data = Stitches.canvas.toDataURL();
                } catch (e) {
                    Stitches.pub("page.error", e);
                }

                /* notify  and return */
                Stitches.pub("sprite.image.done", data);
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

                var prefix = Stitches.settings.prefix;

                var backgroundImage
                if (Stitches.settings.dataURI) {
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
                Stitches.pub("sprite.stylesheet.done", data);
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

    var document = window.document;

    // ## Stitches.Icons namespace
    //
    // Holds all methods for working with icons
    Stitches.Icons = (function () {
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

                            var overlap = Stitches.Icons.isOverlapped(icon, placed);
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

    // **Maintain a unique id for each icon**
    var guid = 0;

    // **Maintains a unique name for each icon**
    var nameCache = {};

    // ## Stitches.Icon class
    //
    // Wraps a single icon. Creates a new image from the source
    // and sets additional properties after the image loads.
    // The callback is generally used to handle queueuing
    //
    //     @param {String} name
    //     @param {String} src
    //     @param {Function} cb Optional callback
    Stitches.Icon = function (name, src, cb) {
        var self = this;

        this.guid = guid++;
        this.name = Stitches.Icon.getName(name);

        this.image = new Image();
        this.image.onload = function () {
            self.x = 0;
            self.y = 0;
            self.width = self.image.width + Stitches.settings.padding;
            self.height = self.image.height + Stitches.settings.padding;
            self.area = self.width * self.height;

            if (cb) {
                cb(self);
            }
        }
        this.image.src = src;
    };

    // ### Stitches.Icon.getName
    //
    // Return a unique name. If the name is already in the nameCache,
    // append a value until a unique name is found.
    //
    //     @param {String} name
    //     @return {String}
    Stitches.Icon.getName = function (name) {
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

    // ### Stitches.Icon.clearNameCache
    //
    // Clear the name cache. If a name is passed in, only clear that key
    //
    //     @param {String} name
    //     @return {String}
    Stitches.Icon.clearNameCache = function (name) {
        if (name) {
            delete nameCache[name];
        } else {
            nameCache = {};
        }
    };

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
                Stitches.Page.$dropbox =   $(".dropbox", Stitches.Page.$elem);
                Stitches.Page.$droplabel = $(".droplabel", Stitches.Page.$elem);
                Stitches.Page.$filelist =  $(".filelist", Stitches.Page.$elem);
                Stitches.Page.$buttons =   $(".buttons", Stitches.Page.$elem);
                Stitches.Page.buttons = {
                    $generate:   $("a.generate", Stitches.Page.$buttons),
                    $clear:      $("a.clear", Stitches.Page.$buttons),
                    $sprite:     $("a.dlsprite", Stitches.Page.$buttons),
                    $stylesheet: $("a.dlstylesheet", Stitches.Page.$buttons)
                };

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
                var buttons = Stitches.Page.buttons,
                    $droplabel = Stitches.Page.$droplabel;

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

            // ### bindFileInput
            //
            // Bind all of the event listeners for file input
            bindFileInput: function () {
                var $elem = Stitches.Page.$elem;
                var $stitches = $(".stitches", Stitches.Page.$elem);
                var $cabinet = $("form.cabinet", $elem);
                var $input = $("input.files", $elem);

                // show file input on hover
                $stitches.hover(function () {
                    $cabinet.stop().animate({left: "-5px"}, 250);
                }, function () {
                    $cabinet.stop().animate({left: "-125px"}, 250);
                });

                // on change event, use the drop event to handle files
                $input.bind("change", function () {
                    if (this.files.length) {
                        Stitches.pub("page.drop.done", this.files);
                    }
                    $cabinet.trigger("reset");
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
                        Stitches.pub("file.queue.done", file);
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
                            var icon = new Stitches.Icon(file.name, e.target.result);
                            Stitches.iconQueue.push(icon);

                            /* notify */
                            Stitches.pub("file.icon.done", icon);
                        };
                        reader.readAsDataURL(file);
                    } catch (e) {
                        Stitches.pub("page.error", e);
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
                Stitches.iconQueue = $.grep(Stitches.iconQueue, function (item) {
                    return item !== icon;
                });
                Stitches.Icon.clearNameCache(icon.name);

                /* notify */
                Stitches.pub("file.remove.done", icon);
            },

            // ### unqueueAllIcons
            //
            // Clear all icons from the queue
            unqueueAllIcons: function () {
                $.each(Stitches.iconQueue, function (i, icon) {
                    Stitches.File.unqueueIcon(icon);
                });
                Stitches.Icon.clearNameCache();
            }
        };
    })();

})(window, Stitches, jQuery);