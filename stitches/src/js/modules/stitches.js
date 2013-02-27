// ## modules/stitches
//
// [http://draeton.github.com/stitches](http://draeton.github.com/stitches)
//
// Copyright 2013, Matthew Cobbs
// Licensed under the MIT license.
//
/*global require, define */
define(["jquery", "wrap/modernizr", "util/util", "util/stitches", "util/templates", "modules/file-manager", "modules/drop-box", "modules/canvas", "modules/toolbar", "modules/palette"],
function($, Modernizr, util, stitches, templates, FileManager, DropBox, Canvas, Toolbar, Palette) {

    "use strict";

    (function () {
        if (typeof FileReader === "undefined" || !Modernizr.draganddrop) {
            require(["../lib/dropfile/dropfile"]);
        }

        if (!Modernizr.canvas) {
            require(["../lib/flashcanvas/flashcanvas"]);
        }
    }());

    var defaults = {
        layout: "compact",
        prefix: "sprite",
        padding: 5,
        uri: false
    };

    var Stitches = function (element, options) {
        this.$element = $(element);
        this.settings = $.extend({}, defaults, options);

        this.init();
    };

    Stitches.prototype = {
        constructor: Stitches,

        init: function () {
            this.render();
            this.proxy();
            this.bind();

            this.setFileManager();
            this.setDropBox();
            this.setToolbar();
            this.setLayout();
            this.setCanvas();
            this.setPalettes();
        },

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
            this.$settings = this.$element.find(".stitches-settings");
            this.$properties = this.$element.find(".stitches-properties");
        },

        proxy: function () {
            util.proxy(this, "showOverlay hideOverlay openAbout closeAbout openSettings closeSettings openProperties closeProperties closePalettes processFiles updateToolbar updateProgress errorHandler");
        },

        bind: function () {
            this.$element.on("show-overlay", this.showOverlay);
            this.$element.on("hide-overlay", this.hideOverlay);
            this.$element.on("open-about", this.openAbout);
            this.$element.on("close-about", this.closeAbout);
            this.$element.on("open-settings", this.openSettings);
            this.$element.on("close-settings", this.closeSettings);
            this.$element.on("open-properties", this.openProperties);
            this.$element.on("close-properties", this.closeProperties);
            this.$element.on("close-palettes", this.closePalettes);
            this.$element.on("process-files", this.processFiles);
            this.$element.on("update-toolbar", this.updateToolbar);
            this.$element.on("error", this.errorHandler);
        },

        setFileManager: function () {
            this.fileManager = new FileManager(this.$canvas, {
                progress: this.updateProgress
            });
        },

        setDropBox: function () {
            this.dropBox = new DropBox(this.$dropBox);
        },

        setLayout: function () {
            stitches.setLayout(this.settings.layout);
        },

        setCanvas: function () {
            this.canvas = new Canvas(this.$canvas, {
                padding: this.settings.padding,
                progress: this.updateProgress
            });
        },

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
                            self.canvas.generateSheets(self.settings);
                            self.$element.trigger("hide-overlay");
                        }
                    },
                    clear: {
                        click: function (e) {
                            self.canvas.clear();
                        }
                    },
                    spritesheet: {
                        click: function (e) {}
                    },
                    stylesheet: {
                        click: function (e) {}
                    },
                    about: {
                        click: function (e) {
                            self.$element.trigger("open-about");
                        }
                    }
                }
            });
        },

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
                            var layout = $checked.val();

                            this.source.layout = layout;
                            stitches.setLayout(layout);

                            self.canvas.reset();
                        }
                    },
                    prefix: {
                        "input blur": function (e) {
                            var prefix = $(e.currentTarget).val();

                            this.source.prefix = prefix;
                        }
                    },
                    padding: {
                        "input blur": function (e) {
                            var padding = $(e.currentTarget).val();

                            this.source.padding = padding;
                            self.canvas.padding = padding;

                            $.map(self.canvas.sprites, function (sprite) {
                                sprite.configure({
                                    padding: padding
                                });
                            });

                            self.canvas.reset();
                        }
                    },
                    uri: {
                        "change": function (e) {
                            var uri = $(e.currentTarget).is(":checked");

                            this.source.uri = uri;
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
                            var clean = util.cleanName(name);

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
                settings: settings,
                properties: properties
            };
        },

        showOverlay: function (e, type) {
            this.$overlay.fadeTo("fast", 0.4);
        },

        hideOverlay: function (e) {
            this.$overlay.fadeOut("fast");
        },

        openAbout: function (e) {
            this.closePalettes();

            this.palettes.about.open();
        },

        closeAbout: function (e) {
            if (this.palettes.about.visible) {
                this.palettes.about.close();
            }
        },

        openSettings: function (e) {
            this.closePalettes();

            this.palettes.settings.configure({
                source: this.settings,
                inputs: {
                    layout: this.settings.layout,
                    prefix: this.settings.prefix,
                    padding: this.settings.padding,
                    uri: this.settings.uri
                }
            });

            this.palettes.settings.open();
        },

        closeSettings: function (e) {
            if (this.palettes.settings.visible) {
                this.palettes.settings.close();
            }
        },

        openProperties: function (e, sprite) {
            this.closePalettes();

            this.palettes.properties.configure({
                source: sprite,
                inputs: {
                    name: sprite.name,
                    x: sprite.x + sprite.padding,
                    y: sprite.y + sprite.padding
                }
            });

            this.palettes.properties.open();
        },

        closeProperties: function (e) {
            if (this.palettes.properties.visible) {
                this.palettes.properties.close();
                this.canvas.$element.trigger("clear-active", [true]);
            }
        },

        closePalettes: function (e) {
            this.closeAbout();
            this.closeSettings();
            this.closeProperties();
        },

        processFiles: function (e, files) {
            this.fileManager.processFiles(files);
        },

        updateToolbar: function (e) {
            var $toolbar = this.toolbar.$element;
            var toolbar = this.toolbar;
            var canvas = this.canvas;

            if (canvas.sprites.length) {
                toolbar.enable("reset generate clear");
            } else {
                toolbar.disable("reset generate clear");
            }

            if (canvas.spritesheet && canvas.stylesheet) {
                $toolbar.find("[data-action=spritesheet]").attr("href", canvas.spritesheet);
                $toolbar.find("[data-action=stylesheet]").attr("href", canvas.stylesheet);

                toolbar.enable("spritesheet stylesheet");
            } else {
                $toolbar.find("[data-action=spritesheet]").attr("href", "#");
                $toolbar.find("[data-action=stylesheet]").attr("href", "#");

                toolbar.disable("spritesheet stylesheet");
            }
        },

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

        errorHandler: function (e, err, type) {
            this.updateProgress(1, type || "warning");
        }
    };

    return Stitches;

});