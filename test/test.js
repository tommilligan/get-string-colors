const fs = require("fs");
const path = require("path");

const chai = require("chai");
const assert = chai.assert;
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const GetStringColors = require("../src/index");

require("dotenv-safe").load({
    path: "./test/.env",
    sample: "./test/.env.example"
});
const testDataDir = path.join(__dirname, "data");

// Begin testing

describe("The GetStringColors constructor (default export)", function () {
    it("should be of type function", function () {
        assert.typeOf(GetStringColors, "function");
    });
    it("should error if no parameters", function() {
        expect(function () {
            new GetStringColors(undefined, undefined);
        }).to.throw();
    });
    it("should error if no Google CSE ID", function() {
        expect(function () {
            new GetStringColors(undefined, process.env.GOOGLE_API_KEY);
        }).to.throw();
    });
    it("should error if no Google API Key", function() {
        expect(function () {
            new GetStringColors(process.env.GOOGLE_CSE_ID, undefined);
        }).to.throw();
    });
    it("should not error with Google CSE ID & API Key", function() {
        expect(function () {
            new GetStringColors(process.env.GOOGLE_CSE_ID, process.env.GOOGLE_API_KEY);
        }).to.not.throw();
    });
});

describe("Using a getStringColors instance", function () {
    beforeEach(function(){
        new GetStringColors(process.env.GOOGLE_CSE_ID, process.env.GOOGLE_API_KEY);
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

