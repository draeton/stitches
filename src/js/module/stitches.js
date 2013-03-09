/**
 * # module/stitches
 *
 * ...
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
        layout: "compact",
        prefix: "sprite",
        padding: 5,
        uri: false,
        stylesheet: "css"
    };

    /**
     * ## Stitches
     *
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
         * ...
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
         * ...
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
         * ...
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
         * ...
         */
        test: function () {
            this.hasFileInput = this.$element.find("input.file").length;
        },

        /**
         * ### @bind
         * ...
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
            this.$element.on("update-downloads", $.proxy(this.updateDownloads, this));
            this.$element.on("generate-sheets", $.proxy(this.generateSheets, this));
            this.$element.on("error", $.proxy(this.errorHandler, this));
        },

        /**
         * ### @setDropBox
         * ...
         */
        setDropBox: function () {
            this.dropBox = new DropBox(this.$dropBox);
        },

        /**
         * ### @setManagers
         * ...
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
         * ...
         */
        setImages: function () {
            this.images = this.$element.find("> img").get();
        },

        /**
         * ### @setCanvas
         * ...
         */
        setCanvas: function () {
            this.canvas = new Canvas(this.$canvas, {
                images: this.images,
                padding: this.settings.padding,
                progress: $.proxy(this.updateProgress, this)
            });
        },

        /**
         * ### @setToolbar
         * ...
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
         * ...
         */
        setPalettes: function () {
            var self = this;

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

            var settings = new Palette(this.$settings, {
                name: "settings",
                visible: false,
                actions: {
                    close: {
                        click: function (e) {
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

                            self.update();
                        }
                    },
                    stylesheet: {
                        "change": function (e) {
                            var $checked = this.$element.find("input[name=stylesheet]:checked");
                            var value = $checked.val();

                            self.settings.stylesheet = value;
                            stylesheetManager.set(value);

                            self.update();
                        }
                    },
                    prefix: {
                        "input blur": function (e) {
                            var value = $(e.currentTarget).val();

                            this.source.prefix = value;

                            self.update();
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

                            self.update();
                        }
                    },
                    uri: {
                        "change": function (e) {
                            var value = $(e.currentTarget).is(":checked");

                            this.source.uri = value;

                            self.update();
                        }
                    }
                }
            });

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
                            var sprite = this.source;
                            var name = $(e.currentTarget).val();
                            var clean = sprite.cleanName(name);

                            this.source.name = clean;

                            if (name !== clean) {
                                $(e.currentTarget).val(clean);
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
         * ### @update
         * ...
         */
        update: function () {
            this.canvas.reset();

            if (store && !store.disabled) {
                store.set("stitches-settings", this.settings);
            }
        },

        /**
         * ### @showOverlay
         * ...
         */
        showOverlay: function (e, type) {
            this.$overlay.fadeTo("fast", 0.4);
        },

        /**
         * ### @hideOverlay
         * ...
         */
        hideOverlay: function (e) {
            this.$overlay.fadeOut("fast");
        },

        /**
         * ### @openAbout
         * ...
         */
        openAbout: function (e) {
            this.closePalettes();

            this.palettes.about.open();
        },

        /**
         * ### @closeAbout
         * ...
         */
        closeAbout: function (e) {
            if (this.palettes.about.visible) {
                this.palettes.about.close();
            }
        },

        /**
         * ### @openDownloads
         * ...
         */
        openDownloads: function (e) {
            this.closePalettes();

            this.palettes.downloads.open();
        },

        /**
         * ### @closeDownloads
         * ...
         */
        closeDownloads: function (e) {
            if (this.palettes.downloads.visible) {
                this.palettes.downloads.close();
            }
        },

        /**
         * ### @openSettings
         * ...
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
         * ...
         */
        closeSettings: function (e) {
            if (this.palettes.settings.visible) {
                this.palettes.settings.close();
            }
        },

        /**
         * ### @openProperties
         * ...
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
         * ...
         */
        closeProperties: function (e) {
            if (this.palettes.properties.visible) {
                this.palettes.properties.close();
                this.canvas.$element.trigger("clear-active", [true]);
            }
        },

        /**
         * ### @closePalettes
         * ...
         */
        closePalettes: function (e) {
            this.closeAbout();
            this.closeDownloads();
            this.closeSettings();
            this.closeProperties();
        },

        /**
         * ### @processFiles
         * ...
         */
        processFiles: function (e, files) {
            fileManager.processFiles(files);
        },

        /**
         * ### @updateToolbar
         * ...
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
         * ### @updateDownloads
         * ...
         */
        updateDownloads: function (e) {
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
         * ...
         */
        updateProgress: function (progress, type) {
            var percent = Math.ceil(progress * 100);

            if (percent === 100 && type !== "danger" && type !== "warning") {
                type = "success";
            }

            if (type) {
                this.$progress.attr({
                    "class": "progress progress-striped progress-" + type
                });
            }

            this.$progressBar.css({
                width: percent + "%"
            });
        },

        /**
         * ### @generateSheets
         * ...
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
            this.$element.trigger("update-downloads");
            this.updateProgress(1, "success");
        },

        /**
         * ### @errorHandler
         * ...
         */
        errorHandler: function (e, err, type) {
            this.updateProgress(1, type || "warning");
        }
    };

    return Stitches;

});