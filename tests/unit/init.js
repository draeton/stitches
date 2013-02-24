(function (window) {

    "use strict";

    /**
     * Ensures that tests have cleaned up properly after themselves.
     * Should be passed as the teardown function on all modules'
     * lifecycle object.
     */
    window.moduleTeardown = function () {
        // Allow QUnit.reset to clean up any attached elements
        // before checking for leaks
        QUnit.reset();

        // clear out subscriptions
        //Stitches._topics = {};
    };

}(this));