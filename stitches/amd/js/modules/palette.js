// Copyright 2013, Matthew Cobbs

// Licensed under the MIT license.

define(["jquery","util/util","modules/toolbar"],function(a,e,g){var h={name:"",visible:!1,actions:{},fields:{}},c=function(b,f){this.$element=a(b);this.settings=a.extend({},h,f);this.name=this.settings.name;this.visible=this.settings.visible;this.actions=this.settings.actions;this.fields=this.settings.fields;this.source=null;this.init()};c.classname=".stitches-palette";e.inherit(c,g,{init:function(){this._super("init",this,arguments);this.$element.toggleClass("in",this.visible)},bind:function(){var b=
this;this._super("bind",this,arguments);a.each(this.fields,function(f,c){a.each(c,function(a,d){var c="[name\x3d"+f+"]",e=b.getHandler(b,d);b.$element.on(a,c,e)})})},open:function(){this.$element.addClass("in");this.visible=!0},close:function(){this.$element.removeClass("in");this.visible=!1},configure:function(b){var c=this;this.source=b.source;a.each(b.inputs,function(b,a){var d=c.$element.find("input[name\x3d"+b+"]");switch(d.attr("type")){case "radio":case "checkbox":d=d.removeAttr("checked").filter("[value\x3d"+
a+"]");d.attr("checked","checked");break;default:d.val(a)}})}});return c});