// # wrap/modernizr
//
// Wrap global instance for use in RequireJS modules
//
// > http://draeton.github.com/stitches<br/>
// > Copyright 2013, Matthew Cobbs<br/>
// > Licensed under the MIT license.
/*global require, define, Modernizr */

define(function () {
    "use strict";
    return Modernizr;
});