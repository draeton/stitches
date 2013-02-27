// Copyright 2013, Matthew Cobbs

// Licensed under the MIT license.

define(["jquery","util/util","layouts/base"],function(f,g,h){var d=function(){};g.inherit(d,h,{getDimensions:function(a,e){var c=0,b=0;f.map(a,function(a){b=a.height>b?a.height:b;c+=a.width});return{width:c||e.width,height:b||e.height}},placeSprite:function(a,e,c){for(var b,d=0;2>d;){for(b=0;b<=c.width-a.width;b++){a.x=b;a.y=0;b=this.intersection(a,e);if(!b)return e.push(a),a.show(),!0;b=b.x+b.width-1}c.width+=a.width;c.height+=a.height;d++}return!1}});return d});