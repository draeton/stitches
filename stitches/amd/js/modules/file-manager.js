// Copyright 2013, Matthew Cobbs

// Licensed under the MIT license.

define(["jquery","util/util"],function(b){var e={progress:function(){}},d=function(a,c){this.$element=b(a);this.settings=b.extend({},e,c);this.progress=this.settings.progress;this.processed=this.total=0;this.init()};d.prototype={constructor:d,init:function(){},processFiles:function(a){var c=this;this.total=a.length;this.processed=0;b.map(a,function(a){/jpeg|png|gif/.test(a.type)&&c.processFile(a)});this.progress(0,"info")},processFile:function(a){var c=this,b;try{b=new FileReader,b.onloadend=function(b){c.$element.trigger("create-sprite",
[a.name,b.target.result]);c.progress(++c.processed/c.total)},b.readAsDataURL(a)}catch(d){this.$element.trigger("error",[d])}}};return d});