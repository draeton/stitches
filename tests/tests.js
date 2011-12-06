(function (window, $, Stitches) {
    
    $(function ($) {

        var $stitches = $("#stitches");
        Stitches.init($stitches, {jsdir: "../src"});
	
        module("setup");
        test("init", function () {
            expect(0);
        });

    });

})(window, jQuery, Stitches);
