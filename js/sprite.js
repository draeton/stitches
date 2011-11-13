/*!
 * HTML5 Sprite Generator
 * http://www.matthewcobbs.com/sandbox/html5sprite/
 *
 * Copyright 2011, Matthew Cobbs
 * Licensed under the MIT license.
 */
(function (window) {

    window.Sprite = (function () {
        return {
            init: function () {
                Sprite.filesCount = 0;
                Sprite.Page.init();
            },
            
            generateSprite: function () {
            	Sprite.looseIcons = [];
            	Sprite.placedIcons = [];
            	
            	Sprite.Page.$filelist.find("li").each(function () {
            		var icon = $(this).data("icon");
            		Sprite.looseIcons.push(icon);
            	});
            	
                Sprite.positionImages();
                var sprite = Sprite.makeSprite();
                var stylesheet = Sprite.makeStylesheet();
                
                Sprite.Page.buttons.$sprite.attr("href", sprite);
                Sprite.Page.buttons.$stylesheet.attr("href", stylesheet);
                Sprite.Page.toggleButtons("remove", ["sprite", "stylesheet"]);
            },

            positionImages: function () {
            	// reset position of icons
            	Sprite.looseIcons.forEach(function (icon, idx) {
            		icon.x = icon.y = 0;
            		icon.isPlaced = false;
            	});
            	
                // reverse sort by area
                Sprite.looseIcons = Sprite.looseIcons.sort(function (a, b) {
                    return b.area - a.area;
                });

                // find the ideal sprite for this set of icons
                Sprite.canvas = Sprite.Icons.idealCanvas(Sprite.looseIcons);

                // try to place all of the icons on the ideal canvas
                Sprite.Icons.placeIcons(Sprite.looseIcons, Sprite.placedIcons, Sprite.canvas);

                // trim empty edges
                Sprite.Icons.cropCanvas(Sprite.placedIcons, Sprite.canvas);
            },

            // draw images on canvas
            makeSprite: function () {
                var context = Sprite.canvas.getContext('2d');
                Sprite.placedIcons.forEach(function (icon, idx) {
                    context.drawImage(icon.image, icon.x, icon.y);
                });

                // add save link
                return Sprite.canvas.toDataURL();
            },

            // create stylesheet text
            makeStylesheet: function () {
                // sort by name for css output
                Sprite.placedIcons = Sprite.placedIcons.sort(function (a, b) {
                    return a.name < b.name ? -1 : 1;
                });

                var text = "";
                text += ".sprite {\n";
                text += "    background: url(sprite.png) no-repeat;\n";
                text += "}\n\n";
                
                Sprite.placedIcons.forEach(function (icon, idx) {
                    text += ".sprite-" + icon.name + " {\n";
                    text += "    width: " + icon.width + "px;\n";
                    text += "    height: " + icon.height + "px;\n";
                    text += "    background-position: -" + icon.x + "px -" + icon.y + "px;\n";
                    text += "}\n\n";
                });

                // add save link
                return "data:," + encodeURIComponent(text);
            }
        };
    })();
    
})(this);