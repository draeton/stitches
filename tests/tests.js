(function (window, $, Stitches) {
        
    var $stitches = $("<div>");
    $("body").append($stitches);
	
    module("setup");
    test("init", function () {
        expect(0);
        Stitches.init($stitches, {jsdir: "../build/js"});
    });

})(window, jQuery, Stitches);
