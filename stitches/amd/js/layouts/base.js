// Copyright 2013, Matthew Cobbs

// Licensed under the MIT license.

define(["jquery"],function(j){var c=function(){};c.prototype={constructor:c,getDimensions:function(){},placeSprites:function(){},intersection:function(b,c){var e,f,g,h,d=[],i;j.map(c,function(a){e=a.x<b.x+b.width;f=a.x+a.width>b.x;g=a.y<b.y+b.height;h=a.y+a.height>b.y;e&&(f&&g&&h)&&d.push(a)});d.length&&(i=d.pop());return i}};return c});