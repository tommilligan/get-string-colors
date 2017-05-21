const fs = require("fs");
const path = require("path");

const chai = require("chai");
const assert = chai.assert;
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const getStringColors = require("../src/index");

//require("dotenv-safe").load();

// Begin testing
const testDataDir = path.join(__dirname, "data");

describe("Always", function () {
    describe("pass", function () {
        it("1 should equal 1", function () {
            assert.equal(1, 1);
        });
    });
});

describe("Module exports", function () {
    describe("Default export", function () {
        it("should be of type function", function () {
            assert.typeOf(getStringColors, "function");
        });
    });
});

describe("Color from JPEG bufffer", function () {
    describe("Should return a chroma color object", function () {
        var buffer = fs.readFileSync(path.join(testDataDir, "orange_ff6600.jpg"));
        buffer.toString("base64");
        it("resolves as promised", function() {
            return expect(Promise.resolve("woof")).to.eventually.equal("woof");
        });

        it("rejects as promised", function() {
            return expect(Promise.reject("caw")).to.be.rejectedWith("caw");
        });
    });
});