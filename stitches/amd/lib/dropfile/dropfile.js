/**
 * dropfile.js
 * A free to use drop file polyfill which adds FileReader to sites which don't have the FileAPI
 *
 * @license MIT
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * 
 * @author Andrew Dodson (drew81.com)
 * @since Dec/2010
 */

/*
 * base64.js - Base64 encoding and decoding functions
 *
 * See: http://developer.mozilla.org/en/docs/DOM:window.btoa
 *      http://developer.mozilla.org/en/docs/DOM:window.atob
 *
 * Copyright (c) 2007, David Lindquist <david.lindquist@gmail.com>
 * Released under the MIT license
 * 
 * Modified by Andrew Dodson
 */

/*
 MIT

 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the
 "Software"), to deal in the Software without restriction, including
 without limitation the rights to use, copy, modify, merge, publish,
 distribute, sublicense, and/or sell copies of the Software, and to
 permit persons to whom the Software is furnished to do so, subject to
 the following conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


 @author Andrew Dodson (drew81.com)
 @since Dec/2010
*/
window.Silverlight||(window.Silverlight={});Silverlight._silverlightCount=0;Silverlight.__onSilverlightInstalledCalled=!1;Silverlight.fwlinkRoot="http://go2.microsoft.com/fwlink/?LinkID\x3d";Silverlight.__installationEventFired=!1;Silverlight.onGetSilverlight=null;Silverlight.onSilverlightInstalled=function(){window.location.reload(!1)};
Silverlight.isInstalled=function(c){void 0==c&&(c=null);var a=!1;try{var e=null,f=!1;if(window.ActiveXObject)try{e=new ActiveXObject("AgControl.AgControl"),null===c?a=!0:e.IsVersionSupported(c)&&(a=!0)}catch(g){f=!0}else f=!0;if(f){var m=navigator.plugins["Silverlight Plug-In"];if(m)if(null===c)a=!0;else{var n=m.description;"1.0.30226.2"===n&&(n="2.0.30226.2");for(var j=n.split(".");3<j.length;)j.pop();for(;4>j.length;)j.push(0);for(var h=c.split(".");4<h.length;)h.pop();var l,k;c=0;do l=parseInt(h[c]),
k=parseInt(j[c]),c++;while(c<h.length&&l===k);l<=k&&!isNaN(l)&&(a=!0)}}}catch(o){a=!1}return a};Silverlight.WaitForInstallCompletion=function(){if(!Silverlight.isBrowserRestartRequired&&Silverlight.onSilverlightInstalled){try{navigator.plugins.refresh()}catch(c){}Silverlight.isInstalled(null)&&!Silverlight.__onSilverlightInstalledCalled?(Silverlight.onSilverlightInstalled(),Silverlight.__onSilverlightInstalledCalled=!0):setTimeout(Silverlight.WaitForInstallCompletion,3E3)}};
Silverlight.__startup=function(){navigator.plugins.refresh();Silverlight.isBrowserRestartRequired=Silverlight.isInstalled(null);if(Silverlight.isBrowserRestartRequired){if(window.navigator.mimeTypes){var c=navigator.mimeTypes["application/x-silverlight-2"],a=navigator.mimeTypes["application/x-silverlight-2-b2"],e=navigator.mimeTypes["application/x-silverlight-2-b1"],f=e;a&&(f=a);!c&&(e||a)?Silverlight.__installationEventFired||(Silverlight.onUpgradeRequired(),Silverlight.__installationEventFired=
!0):c&&f&&(c.enabledPlugin&&f.enabledPlugin&&c.enabledPlugin.description!=f.enabledPlugin.description&&!Silverlight.__installationEventFired)&&(Silverlight.onRestartRequired(),Silverlight.__installationEventFired=!0)}}else Silverlight.WaitForInstallCompletion(),Silverlight.__installationEventFired||(Silverlight.onInstallRequired(),Silverlight.__installationEventFired=!0);Silverlight.disableAutoStartup||(window.removeEventListener?window.removeEventListener("load",Silverlight.__startup,!1):window.detachEvent("onload",
Silverlight.__startup))};Silverlight.disableAutoStartup||(window.addEventListener?window.addEventListener("load",Silverlight.__startup,!1):window.attachEvent("onload",Silverlight.__startup));
Silverlight.createObject=function(c,a,e,f,g,m,n){var j={};j.version=f.version;f.source=c;j.alt=f.alt;m&&(f.initParams=m);f.isWindowless&&!f.windowless&&(f.windowless=f.isWindowless);f.framerate&&!f.maxFramerate&&(f.maxFramerate=f.framerate);e&&!f.id&&(f.id=e);delete f.ignoreBrowserVer;delete f.inplaceInstallPrompt;delete f.version;delete f.isWindowless;delete f.framerate;delete f.data;delete f.src;delete f.alt;if(Silverlight.isInstalled(j.version)){for(var h in g)if(g[h]){if("onLoad"==h&&"function"==
typeof g[h]&&1!=g[h].length){var l=g[h];g[h]=function(a){return l(document.getElementById(e),n,a)}}c=Silverlight.__getHandlerName(g[h]);if(null!=c)f[h]=c,g[h]=null;else throw"typeof events."+h+" must be 'function' or 'string'";}slPluginHTML=Silverlight.buildHTML(f)}else slPluginHTML=Silverlight.buildPromptHTML(j);if(a)a.innerHTML=slPluginHTML;else return slPluginHTML};
Silverlight.buildHTML=function(c){var a=[];a.push('\x3cobject type\x3d"application/x-silverlight" data\x3d"data:application/x-silverlight,"');null!=c.id&&a.push(' id\x3d"'+Silverlight.HtmlAttributeEncode(c.id)+'"');null!=c.width&&a.push(' width\x3d"'+c.width+'"');null!=c.height&&a.push(' height\x3d"'+c.height+'"');a.push(" \x3e");delete c.id;delete c.width;delete c.height;for(var e in c)c[e]&&a.push('\x3cparam name\x3d"'+Silverlight.HtmlAttributeEncode(e)+'" value\x3d"'+Silverlight.HtmlAttributeEncode(c[e])+
'" /\x3e');a.push("\x3c/object\x3e");return a.join("")};Silverlight.createObjectEx=function(c){var a=Silverlight.createObject(c.source,c.parentElement,c.id,c.properties,c.events,c.initParams,c.context);if(null==c.parentElement)return a};
Silverlight.buildPromptHTML=function(c){var a="",e=Silverlight.fwlinkRoot,a=c.version;c.alt?a=c.alt:(a||(a=""),a="\x3ca href\x3d'javascript:Silverlight.getSilverlight(\"{1}\");' style\x3d'text-decoration: none;'\x3e\x3cimg src\x3d'{2}' alt\x3d'Get Microsoft Silverlight' style\x3d'border-style: none'/\x3e\x3c/a\x3e".replace("{1}",a),a=a.replace("{2}",e+"108181"));return a};
Silverlight.getSilverlight=function(c){if(Silverlight.onGetSilverlight)Silverlight.onGetSilverlight();var a="";c=String(c).split(".");1<c.length&&(a=parseInt(c[0]),a=isNaN(a)||2>a?"1.0":c[0]+"."+c[1]);c="";a.match(/^\d+\056\d+$/)&&(c="\x26v\x3d"+a);Silverlight.followFWLink("149156"+c)};Silverlight.followFWLink=function(c){top.location=Silverlight.fwlinkRoot+String(c)};
Silverlight.HtmlAttributeEncode=function(c){var a,e="";if(null==c)return null;for(var f=0;f<c.length;f++)a=c.charCodeAt(f),e=96<a&&123>a||64<a&&91>a||43<a&&58>a&&47!=a||95==a?e+String.fromCharCode(a):e+"\x26#"+a+";";return e};
Silverlight.default_error_handler=function(c,a){var e=a.ErrorType,f;f="\nSilverlight error message     \n"+("ErrorCode: "+a.ErrorCode+"\n");f=f+("ErrorType: "+e+"       \n")+("Message: "+a.ErrorMessage+"     \n");"ParserError"==e?(f+="XamlFile: "+a.xamlFile+"     \n",f+="Line: "+a.lineNumber+"     \n",f+="Position: "+a.charPosition+"     \n"):"RuntimeError"==e&&(0!=a.lineNumber&&(f+="Line: "+a.lineNumber+"     \n",f+="Position: "+a.charPosition+"     \n"),f+="MethodName: "+a.methodName+"     \n");
alert(f)};Silverlight.__cleanup=function(){for(var c=Silverlight._silverlightCount-1;0<=c;c--)window["__slEvent"+c]=null;Silverlight._silverlightCount=0;window.removeEventListener?window.removeEventListener("unload",Silverlight.__cleanup,!1):window.detachEvent("onunload",Silverlight.__cleanup)};
Silverlight.__getHandlerName=function(c){var a="";"string"==typeof c?a=c:"function"==typeof c?(0==Silverlight._silverlightCount&&(window.addEventListener?window.addEventListener("unload",Silverlight.__cleanup,!1):window.attachEvent("onunload",Silverlight.__cleanup)),a="__slEvent"+Silverlight._silverlightCount++,window[a]=c):a=null;return a};Silverlight.onRequiredVersionAvailable=function(){};Silverlight.onRestartRequired=function(){};Silverlight.onUpgradeRequired=function(){};
Silverlight.onInstallRequired=function(){};Silverlight.IsVersionAvailableOnError=function(c,a){var e=!1;try{8001==a.ErrorCode&&!Silverlight.__installationEventFired?(Silverlight.onUpgradeRequired(),Silverlight.__installationEventFired=!0):8002==a.ErrorCode&&!Silverlight.__installationEventFired?(Silverlight.onRestartRequired(),Silverlight.__installationEventFired=!0):5014==a.ErrorCode||2106==a.ErrorCode?Silverlight.__verifySilverlight2UpgradeSuccess(a.getHost())&&(e=!0):e=!0}catch(f){}return e};
Silverlight.IsVersionAvailableOnLoad=function(c){var a=!1;try{Silverlight.__verifySilverlight2UpgradeSuccess(c.getHost())&&(a=!0)}catch(e){}return a};Silverlight.__verifySilverlight2UpgradeSuccess=function(c){var a=!1,e=null;try{c.IsVersionSupported("4.0.50401.99")?(e=Silverlight.onRequiredVersionAvailable,a=!0):e=c.IsVersionSupported("4.0.50401.0")?Silverlight.onRestartRequired:Silverlight.onUpgradeRequired,e&&!Silverlight.__installationEventFired&&(e(),Silverlight.__installationEventFired=!0)}catch(f){}return a};
(function(){function c(a,c,e){a.addEventListener?(a.removeEventListener(c,e,!1),a.addEventListener(c,e,!1)):(a.detachEvent("on"+c,e),a.attachEvent("on"+c,e))}window.dropfile=!0;if(!("FileReader"in window))if(Silverlight.isInstalled()){var a;a=document.getElementsByTagName("script");a=a[a.length-1];a=(a.src?a.src:a.getAttribute("src")).match(/(.*\/)/)[0]||"";var e=document.createElement("div");Silverlight.createObjectEx({source:a+"dropfile.xap",parentElement:e,id:"SilverlightControl",properties:{width:"100%",
height:"100%",version:"2.0",background:"#FFFFFF"}});e.style.display="block";e.style.position="absolute";e.style.width=e.style.height="10px";a=function(){return 1===document.getElementsByTagName("body").length?(document.getElementsByTagName("body")[0].appendChild(e),!0):!1};a()||(window.onload=a);e.style.left=e.style.top="-10000px";c(document.body||document,"dragenter",function(a){a=a||window.event;var g=a.target||a.srcElement;c(g,"dragover",function(a){a=a||window.event;"pageX"in a||(a.pageX=a.clientX+
document.body.scrollLeft+document.documentElement.scrollLeft,a.pageY=a.clientY+document.body.scrollTop+document.documentElement.scrollTop);e.style.top=a.pageY-7+"px";e.style.left=a.pageX-7+"px"});window.dropfile=function(){e.style.left=e.style.top="-10000px";for(var a={files:[]},c=0;c<arguments.length;c++){var f=arguments[c].split(",")[0],h=arguments[c].split(",")[1],l={png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",gif:"image/gif"}[f.match(/[^\.]*$/)[0]]||"";a.files[c]={name:f,size:h.length,
data:h,type:l}}try{var k=document.createEvent("DragEvent");k.initDragEvent("drop",!0,!0,window,0,0,0,0,0,!1,!1,!1,!1,0,null,a);g.dispatchEvent(k)}catch(o){if(k=document.createEventObject(),k.files=a.files,g.fireEvent)g.fireEvent("ondrop",k);else if(g.dispatchEvent)g.dispatchEvent(k);else throw"Whoops could not trigger the drop event";}};return!1});window.FileReader=function(){this.onload;this.result;this.readAsDataURL=function(a){this.read("data:"+a.type+";base64,"+a.data)};this.readAsBinaryString=
function(a){this.read(atob(a.data))};this.readAsText=function(a){this.read(atob(a.data))};this.readAsArrayBuffer=function(){throw"Whoops FileReader.readAsArrayBuffer is unimplemented";};this.read=function(a){this.result=a;if(this.onload)this.onload({target:{result:a}});else throw"Please define the onload event handler first";}}}else window.dropfile=!1})();
if(!("btoa"in window))var btoa=function(c){for(var a=[],e=0,f,g;e<c.length;)f=[c.charCodeAt(e++),c.charCodeAt(e++),c.charCodeAt(e++)],g=(f[0]<<16)+((f[1]||0)<<8)+(f[2]||0),a.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d".charAt((g&16515072)>>18),"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d".charAt((g&258048)>>12),"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d".charAt(isNaN(f[1])?64:(g&4032)>>6),"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d".charAt(isNaN(f[2])?
64:g&63));return a.join("")};
if(!("atob"in window))var atob=function(c){var a,e=b=d=[];a=i=0;if(0!=c.length%4||/[^ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=]/.test(c)||/=/.test(c)&&(/=[^=]/.test(c)||/={3}/.test(c)))throw Error("Invalid base64 data");for(;i<c.length;){a=i;for(e=[];i<a+4;i++)e.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d".indexOf(c.charAt(i)));a=(e[0]<<18)+(e[1]<<12)+((e[2]&63)<<6)+(e[3]&63);b=[(a&16711680)>>16,64==e[2]?-1:(a&65280)>>8,64==e[3]?-1:a&255];for(a=
0;3>a;a++)(0<=b[a]||0===a)&&d.push(String.fromCharCode(b[a]))}return d.join("")};