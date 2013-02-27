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
        "jquery": "wrap/jquery",
        "modernizr": "wrap/modernizr"
    }
})