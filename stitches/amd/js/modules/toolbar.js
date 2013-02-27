// Copyright 2013, Matthew Cobbs

// Licensed under the MIT license.

define(["jquery"],function(c){var g={name:"",actions:{}},e=function(a,d){this.$element=c(a);this.settings=c.extend({},g,d);this.name=this.settings.name;this.actions=this.settings.actions;this.init()};e.classname=".stitches-toolbar";e.prototype={constructor:e,init:function(){this.bind()},bind:function(){var a=this;c.each(this.actions,function(d,b){c.each(b,function(b,c){var e="[data-action\x3d"+d+"]",f=a.getHandler(a,c);if("instance"===d)a.$element.on(b,a.getHandler(a,f));else a.$element.on(b,e,f)})})},
getHandler:function(a,d){return function(b){c(b.currentTarget).is(".disabled")?(b.stopPropagation(),b.preventDefault()):d.apply(a,arguments)}},toggleActions:function(a,d){var b=this;"string"===typeof a&&(a=a.split(" "));c.map(a,function(a){b.$element.find("[data-action\x3d"+a+"]").toggleClass("disabled",d)})},enable:function(a){this.toggleActions(a,!1)},disable:function(a){this.toggleActions(a,!0)}};return e});