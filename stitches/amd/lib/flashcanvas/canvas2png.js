/*
 * canvas2png.js
 *
 * Copyright (c) 2010-2011 Shinya Muramatsu
 * Released under the MIT License
 * http://flashcanvas.net/
 */

(function(b){var e=b.getElementsByTagName("script"),f=e[e.length-1].getAttribute("src").replace(/[^\/]+$/,"save.php");window.canvas2png=function(d){if("canvas"===d.tagName.toLowerCase())if("undefined"!==typeof FlashCanvas)FlashCanvas.saveImage(d);else{var a=b.createElement("form"),c=b.createElement("input");a.setAttribute("action",f);a.setAttribute("method","post");c.setAttribute("type","hidden");c.setAttribute("name","dataurl");c.setAttribute("value",d.toDataURL());b.body.appendChild(a);a.appendChild(c);
a.submit();a.removeChild(c);b.body.removeChild(a)}}})(document);