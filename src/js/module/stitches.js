/**
 * # module/stitches
 *
 * Constructor for the stitches module, which encapsulates all of the UI
 * functionality. Instantiated with a DOM element, into which all of the
 * markup is injected and to which the behaviors are attached. Typically
 * used in a DOM ready callback
 *
 * > http://draeton.github.com/stitches<br/>
 * > Copyright 2013 Matthew Cobbs<br/>
 * > Licensed under the MIT license.
 */

define([
    "wrap/jquery",
    "wrap/modernizr",
    "../../../libs/store/store",
    "util/util",
    "util/templates",
    "manager/file",
    "manager/layout",
    "manager/stylesheet",
    "module/drop-box",
    "module/canvas",
    "module/toolbar",
    "module/palette"
],
function($, Modernizr, store, util, templates, fileManager, layoutManager, stylesheetManager, DropBox, Canvas, Toolbar, Palette) {

    "use strict";

    var defaults = {
        layout: "compact", // default canvas sprite placement layout
        prefix: "sprite", // default stylesheet class prefix
        padding: 5, // default padding around sprites in pixels
        uri: false, // whether or not to include the data-uri image (quite large)
        stylesheet: "css" // either css or less at the moment
    };

    /**
     * ## Stitches
     * Create a new `Stitches` instance
     *
     * @constructor
     * @param {element} element
     * @param {object} options
     */
    var Stitches = function (element, options) {
        this.$element = $(element);
        this.settings = $.extend({}, defaults, options);

        this.init();
    };

    Stitches.prototype = {
        constructor: Stitches,

        /**
         * ### @init
         * Run methods to prepare the instance for use
         */
        init: function () {
            this.configure();
            this.render();
            this.test();
            this.bind();

            this.setDropBox();
            this.setToolbar();
            this.setImages();
            this.setCanvas();
            this.setManagers();
            this.setPalettes();

            this.canvas.init();
        },

        /**
         * ### @configure
         * If available, load settings saved by store.js
         */
        configure: function () {
            var settings;

            if (store && !store.disabled) {
                settings = store.get("stitches-settings");
            }

            if (settings) {
                this.settings = $.extend(this.settings, settings);
            }
        },

        /**
         * ### @render
         * Render html using a JS template and grab references
         */
        render: function () {
            var html = templates.stitches({});

            this.$element.append(html);
            this.$overlay = this.$element.find(".stitches-overlay");
            this.$dropBox = this.$element.find(".stitches-drop-box");
            this.$toolbar = this.$element.find(".stitches-toolbar");
            this.$canvas = this.$element.find(".stitches-canvas");
            this.$progress = this.$element.find(".stitches-progress .progress");
            this.$progressBar = this.$element.find(".stitches-progress .bar");
            this.$about = this.$element.find(".stitches-about");
            this.$downloads = this.$element.find(".stitches-downloads");
            this.$settings = this.$element.find(".stitches-settings");
            this.$properties = this.$element.find(".stitches-properties");
        },

        /**
         * ### @test
         * JS-rendered file inputs aren't useable in every browser. Probably
         * needs a workaround. At the moment, this test disables that feature
         */
        test: function () {
            this.hasFileInput = this.$element.find("input.file").length;
        },

        /**
         * ### @bind
         * Bind event handlers to DOM element. $.proxy is used to retain
         * this instance as the callback execution context
         */
        bind: function () {
            this.$element.on("show-overlay", $.proxy(this.showOverlay, this));
            this.$element.on("hide-overlay", $.proxy(this.hideOverlay, this));
            this.$element.on("open-about", $.proxy(this.openAbout, this));
            this.$element.on("close-about", $.proxy(this.closeAbout, this));
            this.$element.on("open-downloads", $.proxy(this.openDownloads, this));
            this.$element.on("close-downloads", $.proxy(this.closeDownloads, this));
            this.$element.on("open-settings", $.proxy(this.openSettings, this));
            this.$element.on("close-settings", $.proxy(this.closeSettings, this));
            this.$element.on("open-properties", $.proxy(this.openProperties, this));
            this.$element.on("close-properties", $.proxy(this.closeProperties, this));
            this.$element.on("close-palettes", $.proxy(this.closePalettes, this));
            this.$element.on("process-files", $.proxy(this.processFiles, this));
            this.$element.on("update-toolbar", $.proxy(this.updateToolbar, this));
            this.$element.on("update-settings", $.proxy(this.updateSettingsPalette, this));
            this.$element.on("update-downloads", $.proxy(this.updateDownloadsPalette, this));
            this.$element.on("generate-sheets", $.proxy(this.generateSheets, this));
            this.$element.on("error", $.proxy(this.errorHandler, this));
        },

        /**
         * ### @setDropBox
         * Create a `DropBox` instance for drag and drop file loading
         */
        setDropBox: function () {
            this.dropBox = new DropBox(this.$dropBox);
        },

        /**
         * ### @setManagers
         * Set various managers for working with files, sprite sheet layout
         * and stylesheets
         */
        setManagers: function () {
            fileManager.set({
                onload: $.proxy(this.canvas.createSprite, this.canvas),
                onprogress: $.proxy(this.updateProgress, this)
            });
            layoutManager.set(this.settings.layout);
            stylesheetManager.set(this.settings.stylesheet);
        },

        /**
         * ### @setImages
         * Set a reference to any pre-initialization images for processing
         */
        setImages: function () {
            this.images = this.$element.find("> img").get();
        },

        /**
         * ### @setCanvas
         * Create a `Canvas` instance for sprite placement and manipulation
         */
        setCanvas: function () {
            this.canvas = new Canvas(this.$canvas, {
                images: this.images,
                padding: this.settings.padding
            }, {
                onprogress: $.proxy(this.updateProgress, this)
            });
        },

        /**
         * ### @setToolbar
         * Create the `Toolbar` instance with handlers
         */
        setToolbar: function () {
            var self = this;

            this.toolbar = new Toolbar(this.$toolbar, {
                name: "toolbar",
                actions: {
                    open: {
                        change: function (e) {
                            var $input = self.$toolbar.find("input[type=file]");
                            var $clone = $input.clone(true).val("");
                            var files = e.target.files;

                            self.$element.trigger("process-files", [files]);
                            $input.replaceWith($clone);
                        }
                    },
                    settings: {
                        click: function (e) {
                            self.$element.trigger("open-settings");
                        }
                    },
                    reset: {
                        click: function (e) {
                            self.canvas.reset();
                        }
                    },
                    generate: {
                        click: function (e) {
                            self.$element.trigger("show-overlay");
                            self.$element.trigger("generate-sheets");
                            self.$element.trigger("hide-overlay");
                        }
                    },
                    clear: {
                        click: function (e) {
                            self.canvas.clear();
                        }
                    },
                    downloads: {
                        click: function (e) {
                            self.$element.trigger("open-downloads");
                        }
                    },
                    about: {
                        click: function (e) {
                            self.$element.trigger("open-about");
                        }
                    }
                }
            });
        },

        /**
         * ### @setPalettes
         * Create the various `Palette` instances with handlers
         */
        setPalettes: function () {
            var self = this;

            // displays about info
            var about = new Palette(this.$about, {
                name: "about",
                visible: true,
                actions: {
                    close: {
                        click: function (e) {
                            this.close();
                        }
                    }
                }
            });

            // displays the sprite, stylesheet and other info for download
            var downloads = new Palette(this.$downloads, {
                name: "downloads",
                visible: false,
                actions: {
                    close: {
                        click: function (e) {
                            this.close();
                        }
                    }
                }
            });

            // display app settings
            var settings = new Palette(this.$settings, {
                name: "settings",
                visible: false,
                actions: {
                    close: {
                        click: function (e) {
                            this.$element.find(":input[name=import]").val("");
                            self.$element.trigger("close-settings");
                        }
                    }
                },
                fields: {
                    layout: {
                        "change": function (e) {
                            var $checked = this.$element.find("input[name=layout]:checked");
                            var value = $checked.val();

                            this.source.layout = value;
                            layoutManager.set(value);

                            self.updateSettings();
                        }
                    },
                    stylesheet: {
                        "change": function (e) {
                            var $checked = this.$element.find("input[name=stylesheet]:checked");
                            var value = $checked.val();

                            self.settings.stylesheet = value;
                            stylesheetManager.set(value);

                            self.updateSettings();
                        }
                    },
                    prefix: {
                        "input blur": function (e) {
                            var value = $(e.currentTarget).val();

                            this.source.prefix = value;

                            self.updateSettings();
                        }
                    },
                    padding: {
                        "input blur": function (e) {
                            var value = $(e.currentTarget).val();

                            this.source.padding = value;
                            self.canvas.padding = value;

                            $.map(self.canvas.sprites, function (sprite) {
                                sprite.configure({
                                    padding: value
                                });
                            });

                            self.updateSettings();
                        }
                    },
                    uri: {
                        "change": function (e) {
                            var value = $(e.currentTarget).is(":checked");

                            this.source.uri = value;

                            self.updateSettings();
                        }
                    },
                    import: {
                        "blur": function (e) {
                            var $input = $(e.currentTarget);
                            var value = $input.val();
                            var data;

                            try {
                                data = JSON.parse(value);
                                self.importData(data);
                            } catch (x) {
                                $input.val("");
                                self.$element.trigger("error", [x]);
                            }
                        }
                    }
                }
            });

            // displays sprite properties
            var properties = new Palette(this.$properties, {
                name: "properties",
                visible: false,
                actions: {
                    close: {
                        click: function (e) {
                            self.$element.trigger("close-properties");
                        }
                    },
                    remove: {
                        click: function (e) {
                            var sprite = this.source;

                            self.canvas.remove(sprite);
                        }
                    }
                },
                fields: {
                    name: {
                        "input blur": function (e) {
                            var $input = $(e.currentTarget);
                            var sprite = this.source;
                            var name = $input.val();
                            var clean = sprite.cleanName(name);

                            this.source.name = clean;

                            if (name !== clean) {
                                $input.val(clean);
                            }
                        }
                    }
                }
            });

            this.palettes = {
                about: about,
                downloads: downloads,
                settings: settings,
                properties: properties
            };
        },

        /**
         * ### @updateSettings
         * Perform any necessary recalculations and save the new settings
         * with store.js
         */
        updateSettings: function () {
            // update ui
            this.showOverlay();
            this.canvas.reset();

            // store settings
            if (store && !store.disabled) {
                store.set("stitches-settings", this.settings);
            }
        },

        /**
         * ### @showOverlay
         * Block the UI
         *
         * @param {event} e The event object
         */
        showOverlay: function (e) {
            this.$overlay.fadeTo("fast", 0.4);
        },

        /**
         * ### @hideOverlay
         * Unblock the UI
         *
         * @param {event} e The event object
         */
        hideOverlay: function (e) {
            this.$overlay.fadeOut("fast");
        },

        /**
         * ### @openAbout
         * Open the about palette, hide others
         *
         * @param {event} e The event object
         */
        openAbout: function (e) {
            this.closePalettes();

            this.palettes.about.open();
        },

        /**
         * ### @closeAbout
         * Close the about palette, if visible
         *
         * @param {event} e The event object
         */
        closeAbout: function (e) {
            if (this.palettes.about.visible) {
                this.palettes.about.close();
            }
        },

        /**
         * ### @openDownloads
         * Open the downloads palette, hide others
         *
         * @param {event} e The event object
         */
        openDownloads: function (e) {
            this.closePalettes();

            this.palettes.downloads.open();
        },

        /**
         * ### @closeDownloads
         * Close the downloads palette, if visible
         *
         * @param {event} e The event object
         */
        closeDownloads: function (e) {
            if (this.palettes.downloads.visible) {
                this.palettes.downloads.close();
            }
        },

        /**
         * ### @openSettings
         * Open the settings palette, hide others. Configure the inputs
         * with the current settings
         *
         * @param {event} e The event object
         */
        openSettings: function (e) {
            this.closePalettes();

            this.palettes.settings.configure({
                source: this.settings,
                inputs: {
                    layout: this.settings.layout,
                    stylesheet: this.settings.stylesheet,
                    prefix: this.settings.prefix,
                    padding: this.settings.padding,
                    uri: this.settings.uri
                }
            });

            this.palettes.settings.open();
        },

        /**
         * ### @closeSettings
         * Close the settings palette, if visible
         *
         * @param {event} e The event object
         */
        closeSettings: function (e) {
            if (this.palettes.settings.visible) {
                this.palettes.settings.close();
            }
        },

        /**
         * ### @openProperties
         * Open the properties palette, hide others. Configure using the
         * properties of the sprite argument
         *
         * @param {event} e The event object
         * @param {Sprite} sprite Uses these properties
         */
        openProperties: function (e, sprite) {
            this.closePalettes();

            this.palettes.properties.configure({
                source: sprite,
                inputs: {
                    name: sprite.name,
                    x: sprite.left(),
                    y: sprite.top()
                }
            });

            this.palettes.properties.open();
        },

        /**
         * ### @closeProperties
         * Close the properties palette, if visible. This also clears
         * any active sprites
         *
         * @param {event} e The event object
         */
        closeProperties: function (e) {
            if (this.palettes.properties.visible) {
                this.palettes.properties.close();
                this.canvas.$element.trigger("clear-active", [true]);
            }
        },

        /**
         * ### @closePalettes
         * Close all open palettes
         *
         * @param {event} e The event object
         */
        closePalettes: function (e) {
            this.closeAbout();
            this.closeDownloads();
            this.closeSettings();
            this.closeProperties();
        },

        /**
         * ### @processFiles
         * Send a set of files to the file manager for processing
         *
         * @param {event} e The event object
         * @param {array} files For processing
         */
        processFiles: function (e, files) {
            fileManager.processFiles(files);
        },

        /**
         * ### @updateToolbar
         * Update the available actions on the toolbar based on the current
         * state
         *
         * @param {event} e The event object
         */
        updateToolbar: function (e) {
            var toolbar = this.toolbar;
            var canvas = this.canvas;

            if (canvas.sprites.length) {
                toolbar.enable("reset generate clear downloads");
            } else {
                toolbar.disable("reset generate clear downloads");
            }

            if (this.hasFileInput) {
                toolbar.enable("open");
            } else {
                toolbar.disable("open");
            }
        },

        /**
         * ### @updateSettingsPalette
         * Update the settings palette content based on the current state
         *
         * @param {event} e The event object
         */
        updateSettingsPalette: function (e) {
            var $export = this.$settings.find(".downloads-export");

            // buttons
            $export.attr({
                "href": "data:text/plain," + encodeURIComponent(JSON.stringify(this)),
                "target": "_blank"
            });
        },

        /**
         * ### @updateDownloadsPalette
         * Update the downloads palette content based on the current state
         *
         * @param {event} e The event object
         */
        updateDownloadsPalette: function (e) {
            var $section = this.$downloads.find("section");
            var $spritesheet = this.$downloads.find(".downloads-spritesheet");
            var $stylesheet = this.$downloads.find(".downloads-stylesheet");

            var html = templates.downloads({
                prefix: this.settings.prefix,
                spritesheet: this.spritesheet,
                stylesheet: this.stylesheet,
                stylesheetWithUri: this.stylesheetWithUri,
                stylesheetType: stylesheetManager.type,
                stylesheetLines: this.stylesheet.split("\n").length,
                markup: this.markup,
                markupLines: this.markup.split("\n").length,
                markupTooltip: this.markupTooltip
            });

            $section.html(html);

            // buttons
            $spritesheet.attr({
                "href": this.spritesheet,
                "target": "_blank"
            });
            $stylesheet.attr({
                "href": "data:text/plain," + encodeURIComponent(this.stylesheet),
                "target": "_blank"
            });

            // tooltips
            if ($.fn.tooltip) {
                $section.find("[data-toggle=tooltip]").tooltip();
            }
        },

        /**
         * ### @updateProgress
         * Update the progress bar at the top of the UI, right below the toolbar
         *
         * @param {number} progress From 0 to 1
         * @param {type} type Determines the color of the bar
         */
        updateProgress: function (progress, type) {
            var percent = Math.ceil(progress * 100);

            if (percent === 100 && type !== "danger" && type !== "warning") {
                type = "success";
            }

            if (type) {
                this.$progress.attr({
                    "class": "progress progress-" + type
                });
            }

            this.$progressBar.css({
                width: percent + "%"
            });
        },

        /**
         * ### @generateSheets
         * Generate the sprite sheet and stylesheet using the layout manager
         * and stylesheet manager. This is the final product
         *
         * @param {event} e The event object
         */
        generateSheets: function (e) {
            this.spritesheet = layoutManager.getSpritesheet({
                sprites: this.canvas.sprites,
                dimensions: this.canvas.dimensions
            });

            this.stylesheetWithUri = stylesheetManager.getStylesheet({
                sprites: this.canvas.sprites,
                spritesheet: this.spritesheet,
                prefix: this.settings.prefix,
                uri: true
            });

            this.markup = stylesheetManager.getMarkup({
                sprites: this.canvas.sprites,
                prefix: this.settings.prefix
            });

            this.markupTooltip = stylesheetManager.getMarkup({
                sprites: this.canvas.sprites,
                prefix: this.settings.prefix,
                tooltip: true
            });

            // if uri is not checked, we need to generate another
            // stylesheet with the data uri included for the
            // download example rendering
            if (this.settings.uri) {
                this.stylesheet = this.stylesheetWithUri;
            } else {
                this.stylesheet = stylesheetManager.getStylesheet({
                    sprites: this.canvas.sprites,
                    spritesheet: this.spritesheet,
                    prefix: this.settings.prefix,
                    uri: this.settings.uri
                });
            }

            this.$element.trigger("update-toolbar");
            this.$element.trigger("update-settings");
            this.$element.trigger("update-downloads");
            this.updateProgress(1, "success");
        },

        /**
         * ### @errorHandler
         * At the moment, this just changes the progress bar to yellow
         */
        errorHandler: function (e, err, type) {
            this.updateProgress(1, type || "warning");
        },

        /**
         * ### @toJSON
         * Returns serialized object for stitches export
         */
        toJSON: function () {
            return {
                settings: this.settings,
                canvas: this.canvas.toJSON()
            };
        },

        /**
         * ### @importData
         * Use imported data to reconstruct settings and canvas
         *
         * @param {object} data
         */
        importData: function (data) {
            var self = this;
            var settings = data.settings || {};
            var canvas = data.canvas || {sprites: []};
            var sprites = canvas.sprites || [];

            // make sure any new defaults are included
            this.settings = $.extend({}, defaults, settings);

            // update settings
            layoutManager.set(this.settings.layout);
            stylesheetManager.set(this.settings.stylesheet);
            this.updateSettings();

            // update canvas
            this.canvas.clear();
            this.canvas.settings.padding = this.settings.padding;
            $.map(data.canvas.sprites, function (sprite) {
                self.canvas.createSprite(sprite.name, sprite.src);
            });
        }
    };

    return Stitches;

});