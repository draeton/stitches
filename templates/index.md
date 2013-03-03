---
layout: default
title: Stitches - An HTML5 sprite sheet generator
---

<link rel="stylesheet" href="/stitches/repo/build/stitches/css/stitches-@@version-min.css">

<section id="main" role="main">

Drag &amp; drop image files onto the space below, or use the &ldquo;Open&rdquo; link to load images using the file browser. Then, click &ldquo;Generate&rdquo; to create a sprite sheet and stylesheet. <em>This demo uses a couple of HTML5 APIs, and it is only currently compatible with WebKit and Firefox browsers.</em>

<div class="stitches">
    <img src="/stitches/repo/build/stitches/img/test/github.png" data-name="github"/>
    <img src="/stitches/repo/build/stitches/img/test/gmail.png" data-name="gmail"/>
    <img src="/stitches/repo/build/stitches/img/test/linkedin.png" data-name="linkedin"/>
    <img src="/stitches/repo/build/stitches/img/test/stackoverflow.png" data-name="stackoverflow"/>
    <img src="/stitches/repo/build/stitches/img/test/tumblr.png" data-name="tumblr"/>
    <img src="/stitches/repo/build/stitches/img/test/twitter.png" data-name="twitter"/>
</div>

## Implementation

After dependencies, Stitches requires a stylesheet, a script, and an HTML element to get the job done:

{% highlight html %}
<link rel="stylesheet" href="css/stitches-@@version-min.css">

<script data-main="js/stitches.js" src="js/stitches-@@version-min.js"></script>
{% endhighlight %}

The sprite sheet generator is automatically created in elements that have the stitches class:

{% highlight html %}
<div class="stitches"></div>
{% endhighlight %}

If you choose, any images that are a part of the initial markup will be loaded onto the canvas:

{% highlight html %}
<div class="stitches">
    <img src="img/test/github.png" data-name="github"/>
    <img src="img/test/gmail.png" data-name="gmail"/>
    <img src="img/test/linkedin.png" data-name="linkedin"/>
    <img src="img/test/stackoverflow.png" data-name="stackoverflow"/>
    <img src="img/test/tumblr.png" data-name="tumblr"/>
    <img src="img/test/twitter.png" data-name="twitter"/>
</div>
{% endhighlight %}

Documentation is available [here.](/stitches/repo/docs/stitches.js.html)


## Dependencies

[jQuery 1.7.1](http://jquery.com/), [Modernizr 2.0.6](http://modernizr.com/), [Bootstrap 2.3.0](http://twitter.github.com/bootstrap/) <span class="label label-success">New</span>

{% highlight html %}
<link rel="stylesheet" href="libs/bootstrap/css/bootstrap.min.css">
<link rel="stylesheet" href="libs/bootstrap/css/bootstrap-responsive.min.css">

<script src="libs/jquery/jquery-1.7.1.js"></script>
<script src="libs/modernizr/modernizr-2.0.6.min.js"></script>
<script src="libs/bootstrap/js/bootstrap.min.js"></script>
{% endhighlight %}


## Contributing

* [Fork the project.](https://github.com/draeton/stitches)
* Read through the [outstanding issues or report new ones.](https://github.com/draeton/stitches/issues)
* Write some tests to make sure we don't accidentally break each other's code.
* Send a pull request.


## License

[MIT](https://raw.github.com/draeton/stitches/master/LICENSE)


## Download

**The latest release, @@version, is [available here](/stitches/repo/dist/stitches-@@version.zip).**

You can download this project in either [zip](https://github.com/draeton/stitches/zipball/master)
or [tar](https://github.com/draeton/stitches/tarball/master) formats.

You can also clone the project with [Git](http://git-scm.com) by running:

    $ git clone git://github.com/draeton/stitches

</section>

<script data-main="js/stitches.js" src="/stitches/repo/build/stitches/js/stitches-@@version-min.js"></script>