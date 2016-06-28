var expect = require("chai").expect;
var Logger = require("../lib/log.js");

describe("logger", function() {
    it("should log out \"pass\"", function() {
        var debugLog = Logger(true);
        debugLog.d("    pass");
    });
    it("should NOT log out \"fail\"", function() {
        var debugLog = Logger(false);
        debugLog.d("    FAIL!!!");
    });
    it("should log out \"info\"", function() {
        var debugLog = Logger(false);
        debugLog.i("    info");
    });
});
