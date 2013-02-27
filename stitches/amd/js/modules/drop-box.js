// Copyright 2013, Matthew Cobbs

// Licensed under the MIT license.

define(["jquery","util/util"],function(d,e){var f={},c=function(a,b){this.$element=d(a);this.$overlay=this.$element.find(".stitches-overlay");this.settings=d.extend({},f,b);this.init()};c.classname=".stitches-drop-box";c.prototype={constructor:c,init:function(){this.proxy();this.bind()},proxy:function(){e.proxy(this,"dragStart dragStop drop")},bind:function(){var a=this.$element.get(0),b=this.$overlay.get(0);a.addEventListener("dragenter",this.dragStart,!1);b.addEventListener("dragleave",this.dragStop,
!1);b.addEventListener("dragexit",this.dragStop,!1);b.addEventListener("dragover",this.noop,!1);b.addEventListener("drop",this.drop,!1)},noop:function(a){a.preventDefault();a.stopPropagation()},dragStart:function(){this.$element.trigger("close-palettes");this.$element.trigger("show-overlay")},dragStop:function(a){d.contains(this.$element,a.target)&&this.$element.trigger("hide-overlay")},drop:function(a){var b=a.files||a.dataTransfer.files;a.stopPropagation();a.preventDefault();b.length?this.$element.trigger("process-files",
[b]):this.$element.trigger("hide-overlay")}};return c});