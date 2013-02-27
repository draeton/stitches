// Copyright 2013, Matthew Cobbs

// Licensed under the MIT license.

define(["jquery","util/util","layouts/base"],function(i,j,k){var h=function(){};j.inherit(h,k,{getDimensions:function(a,f){var b=0,c=0,e=0,d=0;i.map(a,function(a){b=a.width>b?a.width:b;c=a.height>c?a.height:c;e+=a.area});d=Math.ceil(Math.sqrt(e));b=b>d?b:d;c=c>d?c:d;return{width:b||f.width,height:c||f.height}},placeSprite:function(a,f,b){for(var c,e=0,d,g;2>e;){for(g=0;g<=b.height-a.height;g++){for(d=0;d<=b.width-a.width;d++){a.x=d;a.y=g;c=this.intersection(a,f);if(!c)return f.push(a),a.show(),!0;
d=c.x+c.width-1}g=c.y+c.height-1}b.width+=a.width;b.height+=a.height;e++}return!1}});return h});