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


// Silverlightjs see http://code.msdn.microsoft.com/silverlightjs
//v4.0.50401.0
if (!window.Silverlight) window.Silverlight = {}; Silverlight._silverlightCount = 0; Silverlight.__onSilverlightInstalledCalled = false; Silverlight.fwlinkRoot = "http://go2.microsoft.com/fwlink/?LinkID="; Silverlight.__installationEventFired = false; Silverlight.onGetSilverlight = null; Silverlight.onSilverlightInstalled = function () { window.location.reload(false) }; Silverlight.isInstalled = function (b) { if (b == undefined) b = null; var a = false, m = null; try { var i = null, j = false; if (window.ActiveXObject) try { i = new ActiveXObject("AgControl.AgControl"); if (b === null) a = true; else if (i.IsVersionSupported(b)) a = true; i = null } catch (l) { j = true } else j = true; if (j) { var k = navigator.plugins["Silverlight Plug-In"]; if (k) if (b === null) a = true; else { var h = k.description; if (h === "1.0.30226.2") h = "2.0.30226.2"; var c = h.split("."); while (c.length > 3) c.pop(); while (c.length < 4) c.push(0); var e = b.split("."); while (e.length > 4) e.pop(); var d, g, f = 0; do { d = parseInt(e[f]); g = parseInt(c[f]); f++ } while (f < e.length && d === g); if (d <= g && !isNaN(d)) a = true } } } catch (l) { a = false } return a }; Silverlight.WaitForInstallCompletion = function () { if (!Silverlight.isBrowserRestartRequired && Silverlight.onSilverlightInstalled) { try { navigator.plugins.refresh() } catch (a) { } if (Silverlight.isInstalled(null) && !Silverlight.__onSilverlightInstalledCalled) { Silverlight.onSilverlightInstalled(); Silverlight.__onSilverlightInstalledCalled = true } else setTimeout(Silverlight.WaitForInstallCompletion, 3e3) } }; Silverlight.__startup = function () { navigator.plugins.refresh(); Silverlight.isBrowserRestartRequired = Silverlight.isInstalled(null); if (!Silverlight.isBrowserRestartRequired) { Silverlight.WaitForInstallCompletion(); if (!Silverlight.__installationEventFired) { Silverlight.onInstallRequired(); Silverlight.__installationEventFired = true } } else if (window.navigator.mimeTypes) { var b = navigator.mimeTypes["application/x-silverlight-2"], c = navigator.mimeTypes["application/x-silverlight-2-b2"], d = navigator.mimeTypes["application/x-silverlight-2-b1"], a = d; if (c) a = c; if (!b && (d || c)) { if (!Silverlight.__installationEventFired) { Silverlight.onUpgradeRequired(); Silverlight.__installationEventFired = true } } else if (b && a) if (b.enabledPlugin && a.enabledPlugin) if (b.enabledPlugin.description != a.enabledPlugin.description) if (!Silverlight.__installationEventFired) { Silverlight.onRestartRequired(); Silverlight.__installationEventFired = true } } if (!Silverlight.disableAutoStartup) if (window.removeEventListener) window.removeEventListener("load", Silverlight.__startup, false); else window.detachEvent("onload", Silverlight.__startup) }; if (!Silverlight.disableAutoStartup) if (window.addEventListener) window.addEventListener("load", Silverlight.__startup, false); else window.attachEvent("onload", Silverlight.__startup); Silverlight.createObject = function (m, f, e, k, l, h, j) { var d = {}, a = k, c = l; d.version = a.version; a.source = m; d.alt = a.alt; if (h) a.initParams = h; if (a.isWindowless && !a.windowless) a.windowless = a.isWindowless; if (a.framerate && !a.maxFramerate) a.maxFramerate = a.framerate; if (e && !a.id) a.id = e; delete a.ignoreBrowserVer; delete a.inplaceInstallPrompt; delete a.version; delete a.isWindowless; delete a.framerate; delete a.data; delete a.src; delete a.alt; if (Silverlight.isInstalled(d.version)) { for (var b in c) if (c[b]) { if (b == "onLoad" && typeof c[b] == "function" && c[b].length != 1) { var i = c[b]; c[b] = function (a) { return i(document.getElementById(e), j, a) } } var g = Silverlight.__getHandlerName(c[b]); if (g != null) { a[b] = g; c[b] = null } else throw "typeof events." + b + " must be 'function' or 'string'"; } slPluginHTML = Silverlight.buildHTML(a) } else slPluginHTML = Silverlight.buildPromptHTML(d); if (f) f.innerHTML = slPluginHTML; else return slPluginHTML }; Silverlight.buildHTML = function (a) { var b = []; b.push('<object type="application/x-silverlight" data="data:application/x-silverlight,"'); if (a.id != null) b.push(' id="' + Silverlight.HtmlAttributeEncode(a.id) + '"'); if (a.width != null) b.push(' width="' + a.width + '"'); if (a.height != null) b.push(' height="' + a.height + '"'); b.push(" >"); delete a.id; delete a.width; delete a.height; for (var c in a) if (a[c]) b.push('<param name="' + Silverlight.HtmlAttributeEncode(c) + '" value="' + Silverlight.HtmlAttributeEncode(a[c]) + '" />'); b.push("</object>"); return b.join("") }; Silverlight.createObjectEx = function (b) { var a = b, c = Silverlight.createObject(a.source, a.parentElement, a.id, a.properties, a.events, a.initParams, a.context); if (a.parentElement == null) return c }; Silverlight.buildPromptHTML = function (b) { var a = "", d = Silverlight.fwlinkRoot, c = b.version; if (b.alt) a = b.alt; else { if (!c) c = ""; a = "<a href='javascript:Silverlight.getSilverlight(\"{1}\");' style='text-decoration: none;'><img src='{2}' alt='Get Microsoft Silverlight' style='border-style: none'/></a>"; a = a.replace("{1}", c); a = a.replace("{2}", d + "108181") } return a }; Silverlight.getSilverlight = function (e) { if (Silverlight.onGetSilverlight) Silverlight.onGetSilverlight(); var b = "", a = String(e).split("."); if (a.length > 1) { var c = parseInt(a[0]); if (isNaN(c) || c < 2) b = "1.0"; else b = a[0] + "." + a[1] } var d = ""; if (b.match(/^\d+\056\d+$/)) d = "&v=" + b; Silverlight.followFWLink("149156" + d) }; Silverlight.followFWLink = function (a) { top.location = Silverlight.fwlinkRoot + String(a) }; Silverlight.HtmlAttributeEncode = function (c) { var a, b = ""; if (c == null) return null; for (var d = 0; d < c.length; d++) { a = c.charCodeAt(d); if (a > 96 && a < 123 || a > 64 && a < 91 || a > 43 && a < 58 && a != 47 || a == 95) b = b + String.fromCharCode(a); else b = b + "&#" + a + ";" } return b }; Silverlight.default_error_handler = function (e, b) { var d, c = b.ErrorType; d = b.ErrorCode; var a = "\nSilverlight error message     \n"; a += "ErrorCode: " + d + "\n"; a += "ErrorType: " + c + "       \n"; a += "Message: " + b.ErrorMessage + "     \n"; if (c == "ParserError") { a += "XamlFile: " + b.xamlFile + "     \n"; a += "Line: " + b.lineNumber + "     \n"; a += "Position: " + b.charPosition + "     \n" } else if (c == "RuntimeError") { if (b.lineNumber != 0) { a += "Line: " + b.lineNumber + "     \n"; a += "Position: " + b.charPosition + "     \n" } a += "MethodName: " + b.methodName + "     \n" } alert(a) }; Silverlight.__cleanup = function () { for (var a = Silverlight._silverlightCount - 1; a >= 0; a--) window["__slEvent" + a] = null; Silverlight._silverlightCount = 0; if (window.removeEventListener) window.removeEventListener("unload", Silverlight.__cleanup, false); else window.detachEvent("onunload", Silverlight.__cleanup) }; Silverlight.__getHandlerName = function (b) { var a = ""; if (typeof b == "string") a = b; else if (typeof b == "function") { if (Silverlight._silverlightCount == 0) if (window.addEventListener) window.addEventListener("unload", Silverlight.__cleanup, false); else window.attachEvent("onunload", Silverlight.__cleanup); var c = Silverlight._silverlightCount++; a = "__slEvent" + c; window[a] = b } else a = null; return a }; Silverlight.onRequiredVersionAvailable = function () { }; Silverlight.onRestartRequired = function () { }; Silverlight.onUpgradeRequired = function () { }; Silverlight.onInstallRequired = function () { }; Silverlight.IsVersionAvailableOnError = function (d, a) { var b = false; try { if (a.ErrorCode == 8001 && !Silverlight.__installationEventFired) { Silverlight.onUpgradeRequired(); Silverlight.__installationEventFired = true } else if (a.ErrorCode == 8002 && !Silverlight.__installationEventFired) { Silverlight.onRestartRequired(); Silverlight.__installationEventFired = true } else if (a.ErrorCode == 5014 || a.ErrorCode == 2106) { if (Silverlight.__verifySilverlight2UpgradeSuccess(a.getHost())) b = true } else b = true } catch (c) { } return b }; Silverlight.IsVersionAvailableOnLoad = function (b) { var a = false; try { if (Silverlight.__verifySilverlight2UpgradeSuccess(b.getHost())) a = true } catch (c) { } return a }; Silverlight.__verifySilverlight2UpgradeSuccess = function (d) { var c = false, b = "4.0.50401", a = null; try { if (d.IsVersionSupported(b + ".99")) { a = Silverlight.onRequiredVersionAvailable; c = true } else if (d.IsVersionSupported(b + ".0")) a = Silverlight.onRestartRequired; else a = Silverlight.onUpgradeRequired; if (a && !Silverlight.__installationEventFired) { a(); Silverlight.__installationEventFired = true } } catch (e) { } return c };






/**
* Does the browser not have the FileReader already
*/
(function(){

	// Do we have the ability to drop files?
	window.dropfile = true;

    if (("FileReader" in window)){
        return;
    }

	// Does browser support Silverlight?
	if(!Silverlight.isInstalled()){
		// nope set
		window.dropfile = false;
		return;
	}

    var path = (function (){
        var s = document.getElementsByTagName('script'),
        p = s[s.length-1];
        return (p.src?p.src:p.getAttribute('src')).match(/(.*\/)/)[0] || "";
	})();

    /**
     * Create the Silverlight Overlay, this will be moved into position once drop occurs
     */
    var sl = document.createElement('div');
    Silverlight.createObjectEx({
        source: path + "dropfile.xap",
        parentElement: sl,
        id: "SilverlightControl",
        properties: {
            width: "100%",
            height: "100%",
            version: "2.0",
            background: "#FFFFFF"
            //   isWindowless:"True",
            //   background: "#00FFFFFF"
        }
    });

    // Position the silverlight container iniitally
    sl.style.display = 'block';
    sl.style.position = 'absolute';
    sl.style.width = sl.style.height = "10px";

	
    var attach = function(){
    	if(document.getElementsByTagName('body').length===1){
    		document.getElementsByTagName('body')[0].appendChild(sl);
    		return true;
    	}
    	return false;
    };
   	if(!attach()){
    	window.onload = attach;
   	};

    hide();

    function hide(e) {
        sl.style.left = sl.style.top = "-10000px";
    }
	/**
	 * Add eventlistner
	 */
	function addEvent(el,name,func){
		if(el.addEventListener){
		    el.removeEventListener(name, func, false);
		    el.addEventListener(name, func, false);
		}
		else {
		    el.detachEvent('on'+name, func);
		    el.attachEvent('on'+name, func);
		}
	}

    /**
    * DragEnter + Event delegation,
    * When a drag enter event occurs if the current target is a drop zone overlay element with the Silverlight app.
    */
   addEvent( (document.body||document), "dragenter", function(event) {
        //IE doesn't pass in the event object
        event = event || window.event;

        //IE uses srcElement as the target
        var el = event.target || event.srcElement;

        // Use the dragover events to keep the silver light widget under the mouse cursor
        addEvent( el, "dragover", function (e) {
            e = e || window.event;
            // Define pageX and pageY if the window doesn't already have them defined.
            if (!("pageX" in e)) {
                e.pageX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                e.pageY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }
            // Update the position of the silverlight widget
            sl.style.top = (e.pageY - 7) + "px";
            sl.style.left = (e.pageX - 7) + "px";
        });


        /**
        * Add Callback which will be triggered via silverlight
        */
        window.dropfile = function () {
            // Instantly hide the SilverLight Application
            hide(true);
            // Drop the file
            // We are trying to recreate an event here... 
            // this is very hacky and means we have to recreate everything in a typical event otherwise we can break code
            var dataTransfer = { files: [] };

            for (var i = 0; i < arguments.length; i++) {
                     // filename
                var name = arguments[i].split(',')[0],
                    // data
                    base64 = arguments[i].split(',')[1],
                    // mime type based upon extension
                    mime = { png: "image/png",
                        jpg: "image/jpeg",
                        jpeg: "image/jpeg",
                        gif: "image/gif"
                    }[name.match(/[^\.]*$/)[0]] || "";

                dataTransfer.files[i] = { name: name, size: base64.length, data: base64, type : mime }
            }

            // dispatch events
            try {
                // IE9,FF3<>FF3.5
                var dropEvent = document.createEvent("DragEvent");
                dropEvent.initDragEvent("drop", true, true, window, 0,
	                                        0, 0, 0, 0,
                //event.screenX, event.screenY, event.clientX, event.clientY, 
	                                        false, false, false, false,
                //event.ctrlKey, event.altKey, event.shiftKey, event.metaKey, 
	                                        0, null, dataTransfer);
                el.dispatchEvent(dropEvent);
            }
            catch (e) {
                // <=IE8, <FF3
                var dropEvent = document.createEventObject();
                dropEvent.files = dataTransfer.files;

                if (el.fireEvent) {
                    el.fireEvent('ondrop', dropEvent);
                } else if (el.dispatchEvent) {
                    el.dispatchEvent(dropEvent);
                } else throw ("Whoops could not trigger the drop event");
            }
        };
		return false;
    });
	

    /**
    * Add FileReader to the window object
    */
    window.FileReader = function () {
    	
        this.onload;
        this.result;
        this.readAsDataURL = function (file) {
            // Use the extension from the filename to determine the MIME-TYPE
            this.read("data:" + file.type + ";base64," + file.data);
        };
        this.readAsBinaryString = function(file){
            this.read(atob(file.data));
        };
        this.readAsText = function(file, encoding){
            this.read(atob(file.data));
        };
        this.readAsArrayBuffer = function(file){
        	throw("Whoops FileReader.readAsArrayBuffer is unimplemented");
        }

        // Generic response
        // Passes a fake ProgressEvent
        this.read = function(result,opt){
            this.result = result;
            if (this.onload) {
                this.onload({
                    target: { result: result }
                });
            }
            else throw ("Please define the onload event handler first");
        };
    };


})();


/**
 * Base64 Encoding as documented at...
 * http://www.webtoolkit.info/javascript-base64.html
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
if(!('btoa' in window)){
	function btoa(s) {
		var c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
			e = [],
			i = 0, 
			b,
			buf;

		while(i<s.length){
			b = [s.charCodeAt(i++),s.charCodeAt(i++),s.charCodeAt(i++)];
			buf = (b[0] << 16) + ((b[1] || 0) << 8) + (b[2] || 0);
			e.push(
				c.charAt((buf & (63 << 18)) >> 18),
				c.charAt((buf & (63 << 12)) >> 12),
				c.charAt(isNaN(b[1]) ? 64 : (buf & (63 << 6)) >> 6),
				c.charAt(isNaN(b[2]) ? 64 : (buf & 63))
			);
		}
		return e.join('');
	}
}

if(!('atob' in window)) {
	function atob(s) {
		var c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=', 
			buf,
			a = b = d = [],
			j = i = 0;
		
		if ((s.length % 4 != 0) || (new RegExp('[^' + c + ']').test(s)) || (/=/.test(s) && (/=[^=]/.test(s) || /={3}/.test(s))))
			throw new Error('Invalid base64 data');
		
		while(i<s.length){
			j=i;
			a=[];
			for(;i<j+4;i++)
				a.push(c.indexOf(s.charAt(i)));
			
			buf = (a[0] << 18) + (a[1] << 12) + ((a[2] & 63) << 6) + (a[3] & 63);
			b = [((buf & (255 << 16)) >> 16), ((a[2] == 64) ? -1 : (buf & (255 << 8)) >> 8),((a[3] == 64) ? -1 : (buf & 255))];
			
			for(j=0;j<3;j++)
				if (b[j] >= 0||j===0)
					d.push(String.fromCharCode(b[j]));
		}
		return d.join('');
	}
}
