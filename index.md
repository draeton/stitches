---
layout: default
title: Stitches - An HTML5 sprite sheet generator
---

<link rel="stylesheet" href="/stitches/repo/build/stitches/css/stitches-1.0.53-min.css">

<section id="main" role="main">

Drag &amp; drop image files onto the space below, or use the &ldquo;Open&rdquo; link to load images using the file browser. Then, click &ldquo;Generate&rdquo; to create a sprite sheet and stylesheet. <em>This demo uses a couple of HTML5 APIs, and it is only currently compatible with WebKit and Firefox browsers.</em>

<a href="http://www.w3.org/html/logo/"><img src="http://www.w3.org/html/logo/badge/html5-badge-h-css3-graphics-semantics-storage.png" height="50" alt="HTML5 Powered with CSS3 / Styling, Graphics, 3D &amp; Effects, Semantics, and Offline &amp; Storage" title="HTML5 Powered with CSS3 / Styling, Graphics, 3D &amp; Effects, Semantics, and Offline &amp; Storage"></a>

<div class="stitches"></div>


## Implementation

After dependencies, Stitches requires a stylesheet, a script, and an HTML element to get the job done:

{% highlight html %}
<link rel="stylesheet" href="css/stitches-1.0.53-min.css">

<script data-main="js/stitches.js" src="js/stitches-1.0.53-min.js"></script>
{% endhighlight %}

The sprite sheet generator is automatically created in elements that have the stitches class:

{% highlight html %}
<div class="stitches"></div>
{% endhighlight %}

Documentation is available [here.](/stitches/repo/docs/stitches.js.html)


## Dependencies

[jQuery 1.7.1](http://jquery.com/), [Modernizr 2.0.6](http://modernizr.com/), [Bootstrap 2.3.0](http://twitter.github.com/bootstrap/) <span class="label label-success">New</span>

{% highlight html %}
<link rel="stylesheet" href="lib/bootstrap/css/bootstrap.min.css">
<link rel="stylesheet" href="lib/bootstrap/css/bootstrap-responsive.min.css">

<script src="lib/jquery/jquery-1.7.1.js"></script>
<script src="lib/modernizr/modernizr-2.0.6.min.js"></script>
<script src="lib/bootstrap/js/bootstrap.min.js"></script>
{% endhighlight %}


## Contributing

* [Fork the project.](https://github.com/draeton/stitches)
* Read through the [outstanding issues or report new ones.](https://github.com/draeton/stitches/issues)
* Write some tests to make sure we don't accidentally break each other's code.
* Send a pull request.


## License

[MIT](https://raw.github.com/draeton/stitches/master/LICENSE)


## Download

**The latest release, 1.0.53, is [available here](/stitches/repo/dist/stitches-1.0.53.zip).**

You can download this project in either [zip](https://github.com/draeton/stitches/zipball/master)
or [tar](https://github.com/draeton/stitches/tarball/master) formats.

You can also clone the project with [Git](http://git-scm.com) by running:

    $ git clone git://github.com/draeton/stitches

</section>

<script data-main="js/stitches.js" src="/stitches/repo/build/stitches/js/stitches-1.0.53-min.js"></script>