/*!
 * Stitches - HTML5 Sprite Generator
 * http://draeton.github.com/Stitches
 *
 * Copyright 2011, Matthew Cobbs
 * Licensed under the MIT license.
 */
(function(b,c){var a=0;c.Icon=function(f,g,d){var e=this;this.guid=a++;this.name=f.replace(/\.|\s+/gi,"-");this.image=new Image();this.image.onload=function(){e.x=0;e.y=0;e.width=e.image.width;e.height=e.image.height;e.area=e.width*e.height;if(d){d(e)}};this.image.src=g}})(window,Stitches);