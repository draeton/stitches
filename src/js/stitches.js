/**
 * # Stitches
 *
 * ### _An HTML5 Sprite Sheet Generator_
 *
 * > http://draeton.github.io/stitches<br/>
 * > Copyright 2013 Matthew Cobbs<br/>
 * > Licensed under the MIT license.
 *
 * Stitches is an HTML5 sprite sheet generator.
 *
 * Stitches is developed by Matthew Cobbs in concert with the lovely open-source
 * community at Github. Thanks are owed to the developers at Twitter for
 * [Bootstrap](http://twitter.github.io/bootstrap), and
 * [Glyphicons](http://glyphicons.com/) for some cool little icons.
 *
 * Addtionally, I want to thank [James Taylor](https://github.io/jbt)
 * for the [Docker](https://github.io/jbt/docker) documentation tool, and most
 * of all the good folks who develop [RequireJS](http://requirejs.org/) and
 * [GruntJS](http://gruntjs.com/), for helping this all make sense.
 */

/**
 * ### RequireJS Main
 *
 * Kicks off application on elements matching `.stitches`
 */
require({
    paths: {
        "tpl" : "../tpl"
    }
},
[
    "wrap/jquery",
    "module/stitches"
],
function($, Stitches) {

    "use strict";

    $(document).ready(function () {

        var selector = ".stitches";

        $(selector).each(function () {
            var stitches = new Stitches(this);
        });
    });

});