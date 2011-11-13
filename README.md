#Stitches - An HTML5 sprite generator

##Notes

TODO. [Demo here](http://draeton.github.com/Stitches/).

##Stylesheet

    <link rel="stylesheet" href="css/stitches.css">

##HTML Markup

    <div id="dropbox">
        <span id="droplabel">Drop images here...</span>
        <ul id="filelist"><!-- files go here --></ul>
    </div>
    <div id="buttons">
        <a href="javascript:void(0)" class="generate disabled">Generate</a>
        <a href="javascript:void(0)" class="sprite disabled" target="_blank">Sprite &raquo;</a>
        <a href="javascript:void(0)" class="stylesheet disabled" target="_blank">Stylesheet &raquo;</a>
        <a href="javascript:void(0)" class="clear disabled">Clear Images</a>
    </div>

    <!-- Grab Google CDN's jQuery, with a protocol relative URL; fall back to local if offline -->
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"></script>
    <script>window.jQuery || document.write('<script src="js/libs/jquery-1.6.2.min.js"><\/script>')</script>

    <script defer src="js/mylibs/stitches/main.js"></script>
    <script defer src="js/mylibs/stitches/page.js"></script>
    <script defer src="js/mylibs/stitches/icon.js"></script>
    <script defer src="js/mylibs/stitches/icons.js"></script>
    <script defer src="js/plugins.js"></script>
    <script defer src="js/script.js"></script>

##Implementation

    (function ($, Stitches) {
        $(Stitches.init);
    }(jQuery, Stitches));