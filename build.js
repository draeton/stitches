({
    appDir: "src",
    baseUrl: "js",
    dir: "amd",
    optimize: "closure",

    modules: [
        {
            name: "stitches"
        }
    ],

    paths: {
        "lib": "../lib",
        "tpl" : "../tpl",
        "jquery": "wrap/jquery",
        "modernizr": "wrap/modernizr"
    }
})