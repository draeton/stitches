[![build status](https://raw.github.com/draeton/stitches/master/out/status.png)](http://draeton.github.com/stitches/)

[Stitches](http://draeton.github.com/stitches/)
==========

Stitches is an HTML5 sprite sheet generator.
The current version is `1.1.0`. Documentation is available
[here](http://draeton.github.com/stitches/repo/docs/stitches.js.html).

## Implementation

After dependencies, Stitches requires a stylesheet, a script, and an HTML element to get the job done:

```html
<link rel="stylesheet" href="css/stitches-1.1.0-min.css">

<script data-main="js/stitches.js" src="js/stitches-1.1.0-min.js"></script>
```

The sprite sheet generator is automatically created in elements that have the `stitches` class:

```html
<div class="stitches"></div>
```

If you choose, any images that are a part of the initial markup will be loaded onto the canvas:

```html
<div class="stitches">
    <img src="img/test/github.png" data-name="github"/>
    <img src="img/test/gmail.png" data-name="gmail"/>
    <img src="img/test/linkedin.png" data-name="linkedin"/>
    <img src="img/test/stackoverflow.png" data-name="stackoverflow"/>
    <img src="img/test/tumblr.png" data-name="tumblr"/>
    <img src="img/test/twitter.png" data-name="twitter"/>
</div>
```

## Dependencies

[jQuery 1.7.1](http://jquery.com/), [Modernizr 2.0.6](http://modernizr.com/), [Bootstrap 2.3.0](http://twitter.github.com/bootstrap/)

```html
<link rel="stylesheet" href="lib/bootstrap/css/bootstrap.min.css">
<link rel="stylesheet" href="lib/bootstrap/css/bootstrap-responsive.min.css">

<script src="lib/jquery/jquery-1.7.1.js"></script>
<script src="lib/modernizr/modernizr-2.0.6.min.js"></script>
<script src="lib/bootstrap/js/bootstrap.min.js"></script>
```

## License

(The MIT License)

Copyright (c) 2013, <[Matthew Cobbs](mailto:draeton@gmail.com)>

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