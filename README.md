## Stitches

[Stitches](http://github.matthewcobbs.com/stitches/) is an HTML5 sprite generator.

### Version

    0.1.0

### Dependencies

jQuery 1.6.2+, Modernizr; *Dropfile, Flashcanvas for older browser support*

### Implementation

Stitches requires a stylesheet, a script, and an HTML element to get the job done:

    <link rel="stylesheet" href="css/stitches.css">

    <script defer src="js/jquery-1.6.2.min.js"></script>
    <script defer src="js/modernizr-2.0.6.min.js"></script>

    <script defer src="js/stitches.min.js"></script>

Once that's in place, the sprite generator is created by the `init` method:

    <div id="stitches"></div>

    <script>
    (function ($, Stitches) {

        var $stitches = $("#stitches");
        Stitches.init($stitches);

    }(jQuery, Stitches));
    </script>

### TODO

* fix dropfile and flashcanvas support
* add ability to configure file locations and other props
* minify and concat
* write unit tests
* more comments

### License

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