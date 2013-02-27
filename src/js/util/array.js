// ## util/array
//
// [http://draeton.github.com/stitches](http://draeton.github.com/stitches)
//
// Copyright 2013, Matthew Cobbs
// Licensed under the MIT license.
//
/*global require, define */
define(["jquery"],
function ($) {

    "use strict";

    return {
        remove: function (array, value) {
            return $(array).filter(function () {
                return this !== value;
            });
        }
    };

});