(function (window, undefined) {

    "use strict";


    module("main", {
        teardown: window.moduleTeardown
    });


    test("Basic requirements", function() {
        expect(4);
        ok( window, "window" );
        ok( Stitches, "Stitches" );
        ok( jQuery, "jQuery" );
        ok( $, "$" );
    });


    test("Stitches.init()", function () {
        expect(2);

        equal( typeof Stitches.init, "function" );
        equal( Stitches.init.length, 2 );
    });


    // for now, do the init method here
    $(function ($) {
        var $elem = $("#stitches");
        Stitches.init($elem, {jsdir: "../src"});
    });

}(window));