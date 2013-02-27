// ## Stitches - HTML5 Sprite Sheet Generator
//
// [http://draeton.github.com/stitches](http://draeton.github.com/stitches)
//
// Copyright 2013, Matthew Cobbs
// Licensed under the MIT license.
//
/*global requirejs, require, define */
requirejs.config({
    paths: {
        "jquery": "wrap/jquery",
        "modernizr": "wrap/modernizr"
    }
});

require(["jquery", "modules/stitches"],
function($, Stitches) {

    "use strict";

    $(document).ready(function () {

        var selector = ".stitches";

        $(selector).each(function () {
            var stitches = new Stitches(this);
        });
    });

});