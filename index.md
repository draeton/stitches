---
layout: default
title: Stitches - An HTML5 sprite sheet generator
---

<link rel="stylesheet" href="http://draeton.github.com/stitches/stitches/build/css/stitches-0.5.18-min.css">

<section id="main" role="main">

Drag and drop image files into the space below and click "Generate" to create a 
sprite sheet and stylesheet. This demo uses a couple of HTML5 APIs, and **it is only 
currently compatible with the latest versions of Chrome and Firefox.**

<a href="http://www.w3.org/html/logo/"><img src="http://www.w3.org/html/logo/badge/html5-badge-h-css3-graphics-semantics-storage.png" height="50" alt="HTML5 Powered with CSS3 / Styling, Graphics, 3D &amp; Effects, Semantics, and Offline &amp; Storage" title="HTML5 Powered with CSS3 / Styling, Graphics, 3D &amp; Effects, Semantics, and Offline &amp; Storage"></a>

<div id="stitches"></div>
    

## Implementation

Stitches requires a stylesheet, a script, and an HTML element to get the job done:

{% highlight html %}
<link rel="stylesheet" href="css/stitches-0.5.18-min.css">

<script src="js/jquery-1.7.1.min.js"></script>
<script src="js/modernizr-2.0.6.min.js"></script>

<script src="js/stitches-0.5.18-min.js"></script>
{% endhighlight %}

Once that's in place, the sprite sheet generator is created by the `init` method:

{% highlight html %}
<div id="stitches"></div>

<script>
jQuery(document).ready(function ($) {

    var $stitches = $("#stitches");
    Stitches.init($stitches, {jsdir: "js"});

});
</script>
{% endhighlight %}

Documentation is available [here.](http://draeton.github.com/stitches/stitches/docs/stitches.html)
    

## Dependencies

[jQuery 1.7.1+](http://jquery.com/) <span class="label success">New</span>, [Modernizr](http://www.modernizr.com/), 
*[Dropfile](https://github.com/MrSwitch/dropfile), [Flashcanvas](http://flashcanvas.net/) 
for older browser support*


## Contributing

* [Fork the project.](https://github.com/draeton/stitches)
* Read through the [outstanding issues or report new ones.](https://github.com/draeton/stitches/issues)
* Write some tests to make sure we don't accidentally break each other's code.
* Send a pull request.


## License

[MIT](https://raw.github.com/draeton/stitches/master/LICENSE)


## Download

**The latest release, 0.5.18, is [available here](http://draeton.github.com/stitches/stitches/dist/stitches-0.5.18.zip).**

You can download this project in either [zip](https://github.com/draeton/stitches/zipball/master) 
or [tar](https://github.com/draeton/stitches/tarball/master) formats.

You can also clone the project with [Git](http://git-scm.com) by running:

    $ git clone git://github.com/draeton/stitches

</section>

<script>
Modernizr.load({
    load: "/stitches/stitches/build/js/stitches-0.5.18-min.js",
    complete: function () {
        $(function () {
    
            var $stitches = $("#stitches");
            Stitches.init($stitches, {jsdir: "stitches/build/js"});

        });
    }
});
</script>