// ## util/templates
//
// [http://draeton.github.com/stitches](http://draeton.github.com/stitches)
//
// Copyright 2013, Matthew Cobbs
// Licensed under the MIT license.
//
/*global require, define */
define(["wrap/jquery", "text!../../templates/stitches.html", "text!../../templates/sprite.html"],
function ($, stitchesTemplate, spriteTemplate) {

    "use strict";

    var cache = {};

    var tmpl = function (str, data) {
        /* Figure out if we're getting a template, or if we need to
           load the template - and be sure to cache the result. */
        var fn = !/\W/.test(str) ? cache[str] = cache[str] || tmpl(document.getElementById(str).innerHTML) :

        /* Generate a reusable function that will serve as a template
           generator (and which will be cached). */
        /*jshint evil:true*/
        new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};" +
        /*jshint evil:false*/

        /* Introduce the data as local variables using with(){} */
        "with(obj){p.push('" +

        /* Convert the template into pure JavaScript */
        str.replace(/[\r\t\n]/g, " ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'") + "');}return p.join('');");

        /* Provide some basic currying to the user */
        return data ? fn(data) : fn;
    };

    var compile = function (template, id) {
        $(window.document.body).append(template);

        return tmpl(id);
    };

    return {
        tmpl: tmpl,
        stitches: compile(stitchesTemplate, "stitches_tmpl"),
        sprite: compile(spriteTemplate, "stitches_sprite_tmpl")
    };

});