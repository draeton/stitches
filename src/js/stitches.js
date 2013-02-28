/**
 * # Stitches
 * ### _An HTML5 Sprite Sheet Generator_
 *
 * > http://draeton.github.com/stitches<br/>
 * > Copyright 2013, Matthew Cobbs<br/>
 * > Licensed under the MIT license.
 *
 * Stitches is an HTML5 sprite sheet generator.
 *
 * Stitches is developed by Matthew Cobbs in concert with the lovely open-source
 * community at Github. Thanks are owed to the developers at Twitter for
 * [Bootstrap](http://twitter.github.com/bootstrap), and
 * [Glyphicons](http://glyphicons.com/) for some cool little icons.
 *
 * Addtionally, I want to thank [James Taylor](https://github.com/jbt)
 * for the [Docker](https://github.com/jbt/docker) documentation tool, and
 * [Phil Mander](https://github.com/philmander) for his JSHint and JSTestRunner
 * Ant tasks, which round out my build toolchain, and most of all the good folks
 * who develop [RequireJS](http://requirejs.org/) for helping this all make
 * sense.
 */
/*global requirejs, require, define */

/**
 * ## RequireJS Configuration
 *
 * Configuring RequireJS paths for wrapped globals
 */
requirejs.config({
    paths: {
        "jquery": "wrap/jquery",
        "modernizr": "wrap/modernizr"
    }
});

/**
 * ## RequireJS Main
 *
 * Kicks off application on elements matching `.stitches`
 */
require(["jquery", "module/stitches"],
function($, Stitches) {

    "use strict";

    $(document).ready(function () {

        var selector = ".stitches";

        $(selector).each(function () {
            var stitches = new Stitches(this);
        });
    });

});