#Stitches - An HTML5 sprite generator

##Demo

[Here.](http://github.matthewcobbs.com/Stitches/).

## Dependencies

    jQuery 1.6.2+, Modernizr (Dropfile, Flashcanvas for older browser support)

##Setup

    <!-- Stitches -->
    <link rel="stylesheet" href="src/stitches/stitches.css">

    <script defer src="src/stitches/main.js"></script>
    <script defer src="src/stitches/page.js"></script>
    <script defer src="src/stitches/icon.js"></script>
    <script defer src="src/stitches/icons.js"></script>

##Markup

    <div id="stitches"></div>

##Implementation

    (function ($, Stitches) {

        var $stitches = $("#stitches");
        Stitches.init($stitches);

    }(jQuery, Stitches));

##TODO

* minify and concat
* add ability to configure file locations
* more comments
* fix dropfile and flashcanvas support