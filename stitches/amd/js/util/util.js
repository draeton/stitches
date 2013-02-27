// Copyright 2013, Matthew Cobbs

// Licensed under the MIT license.

define(["jquery"],function(c){return{proxy:function(a,b){"string"===typeof b&&(b=b.split(" "));c.map(b,function(b){a[b]=c.proxy(a[b],a)})},inherit:function(a,b,g){a.prototype=new b;a.prototype.constructor=b;c.each(g,function(b,d){a.prototype[b]=d});a.prototype._super=function(a,d,c){return b.prototype[a].apply(d,c)}},removeValue:function(a,b){return c(a).filter(function(){return this!==b})},debounce:function(a,b,c){var e;return function(){var d=this,f=arguments;e?window.clearTimeout(e):c&&a.apply(d,
f);e=setTimeout(function(){c||a.apply(d,f);e=null},b||50)}},cleanName:function(a){a=a.replace(/\.[a-z]{3,4}$/i,"");return a=a.replace(/[\s.]+/gi,"-").replace(/[^a-z0-9\-]/gi,"_")}}});