// Copyright 2013, Matthew Cobbs

// Licensed under the MIT license.

define(["jquery","text!../../templates/stitches.html","text!../../templates/sprite.html"],function(f,g,h){var d={},c=function(a,e){var b=!/\W/.test(a)?d[a]=d[a]||c(document.getElementById(a).innerHTML):new Function("obj","var p\x3d[],print\x3dfunction(){p.push.apply(p,arguments);};with(obj){p.push('"+a.replace(/[\r\t\n]/g," ").split("\x3c%").join("\t").replace(/((^|%>)[^\t]*)'/g,"$1\r").replace(/\t=(.*?)%>/g,"',$1,'").split("\t").join("');").split("%\x3e").join("p.push('").split("\r").join("\\'")+
"');}return p.join('');");return e?b(e):b},b=function(a,b){f(window.document.body).append(a);return c(b)};return{tmpl:c,stitches:b(g,"stitches_tmpl"),sprite:b(h,"stitches_sprite_tmpl")}});