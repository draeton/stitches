## Stitches

[Stitches](http://draeton.github.com/stitches/) is an HTML5 sprite generator.
The current version is `0.0.37`. Documentatin is available
[here](http://draeton.github.com/stitches/docs/main.html).

## Implementation

Stitches requires a stylesheet, a script, and an HTML element to get the job done:

    <link rel="stylesheet" href="css/stitches-0.0.37-min.css">

    <script src="js/jquery-1.6.2.min.js"></script>
    <script src="js/modernizr-2.0.6.min.js"></script>

    <script src="js/stitches-0.0.37-min.js"></script>

Once that's in place, the sprite generator is created by the `init` method:

    <div id="stitches"></div>

    <script>
    jQuery(document).ready(function ($) {

        var $stitches = $("#stitches");
        Stitches.init($stitches, {jsdir: "js"});

    });
    </script>

## Dependencies

jQuery 1.6.2+, Modernizr; *Dropfile, Flashcanvas for older browser support*

## To-do

* fix dropfile and flashcanvas support
* write unit tests

## License

(The MIT License)

Copyright (c) 2011, <[Matthew Cobbs](mailto:draeton@gmail.com)>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.