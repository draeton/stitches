#Stitches - An HTML5 sprite generator

##Notes

[Demo here](http://github.matthewcobbs.com/Stitches/).

## Dependencies

    jQuery 1.6.2+

##Setup

    <!-- Stitches -->
    <link rel="stylesheet" href="src/stitches/stitches.css">

    <script defer src="src/stitches/main.js"></script>
    <script defer src="src/stitches/page.js"></script>
    <script defer src="src/stitches/icon.js"></script>
    <script defer src="src/stitches/icons.js"></script>

    <!-- TODO: minify and concat -->

##Markup

    <div id="stitches"></div>

##Implementation

    (function ($, Stitches) {

        var $stitches = $("#stitches");
        Stitches.init($stitches);

    }(jQuery, Stitches));