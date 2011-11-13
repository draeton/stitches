/*!
 * Stitches - HTML5 Sprite Generator
 * http://draeton.github.com/Stitches
 *
 * Copyright 2011, Matthew Cobbs
 * Licensed under the MIT license.
 */
(function(b,c){var a=b.document;c.Icons=(function(){return{idealCanvas:function(i){var k=0;var f=0;var j=0;i.forEach(function(m,l){k=m.width>k?m.width:k;f=m.height>f?m.height:f;j+=m.area});var e=Math.ceil(Math.sqrt(j));var d=k>e?k:e;var h=f>e?f:e;var g=a.createElement("canvas");g.width=d;g.height=h;return g},placeIcons:function(g,f,d){var e=0;while(g.length&&e<10){g.forEach(function(i,h){if(!i.isPlaced){i.isPlaced=c.Icons.placeIcon(i,f,d)}});e++}for(e=0;e<g.length;e++){if(g[e].isPlaced){g.splice(e)}}return true},placeIcon:function(h,j,f){var g=0;while(g<2){for(var k=0;k<=f.height-h.height;k++){for(var d=0;d<=f.width-h.width;d++){h.x=d;h.y=k;var e=c.Icons.isOverlapped(h,j);if(!e){return true}d=e.x+e.width}k=e.y+e.height}f.width+=h.width;f.height+=h.height;g++}return false},isOverlapped:function(j,k){var g,f,i,h;var d=[];var e=null;k.forEach(function(m,l){g=(m.x<j.x+j.width);f=(m.x+m.width>j.x);i=(m.y<j.y+j.height);h=(m.y+m.height>j.y);if(g&&f&&i&&h){d.push(m)}});if(d.length){e=d.pop()}else{k.push(j)}return e},cropCanvas:function(g,e){var d=0,f=0;g.forEach(function(i,h){d=d>i.x+i.width?d:i.x+i.width;f=f>i.y+i.height?f:i.y+i.height});e.width=d;e.height=f}}})()})(window,Stitches);