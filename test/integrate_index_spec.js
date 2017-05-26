const fs = require("fs");
const path = require("path");

const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var rewire = require("rewire");

var GoogleImages = require("google-images");
var GetStringColors = rewire("../src/index");

var testDataDir = path.join(__dirname, "data");

require("dotenv-safe").load({
    path: "./test/.env",
    sample: "./test/.env.example"
});

var testData = {
    "imageSearchResults": [
        {
            "url": "http://foo.bar/baz.jpg",
            "type": "image/jpeg",
            "width": 1024,
            "height": 768,
            "size": 102451,
            "thumbnail": {
                "url": "http://foo.bar/thumbnail.jpg",
                "width": 512,
                "height": 512
            }
        },
        {
            "url": "http://green.eggs/ham.jpg",
            "type": "image/png",
            "width": 1024,
            "height": 768,
            "size": 102451,
            "thumbnail": {
                "url": "http://green.eggs/thumbnail.jpg",
                "width": 512,
                "height": 512
            }
        }
    ],
    "imageBufferJpeg": fs.readFileSync(path.join(testDataDir, "orange_ff6600.jpg")),
    "googleImages": new GoogleImages(process.env.GOOGLE_CSE_ID, process.env.GOOGLE_API_KEY),
    "getStringColors": GetStringColors(process.env.GOOGLE_CSE_ID, process.env.GOOGLE_API_KEY)
};


// Begin testing

describe("Using external resources", function () {
    describe("requestImageSearch", function () {
        var private_function = null;
        beforeEach(function() {
            private_function = GetStringColors.__get__("requestImageSearch");
        });
        it("should return results", function () {
            var promise = private_function(testData.googleImages, "dog");
            return expect(promise).to.eventually.be.an("array");
        });
    });
    describe("getColorsFromBuffer", function () {
        var private_function = null;
        beforeEach(function() {
            private_function = GetStringColors.__get__("getColorsFromBuffer");
        });
        it("should return list of 5 chromajs colors", function () {
            const promise = private_function(testData.imageBufferJpeg, "image/jpeg");
            return Promise.all([
                expect(promise).to.eventually.be.an("array"),
                expect(promise).to.eventually.have.lengthOf(5)
            ]);
        });
    });
});

describe("Live end-to-end test", function () {
    it("should succeed with good query", function () {
        const promise = testData.getStringColors("heart");
        return Promise.all([
            expect(promise).to.eventually.be.an("array"),
            expect(promise).to.eventually.have.lengthOf(5)
        ]);
    });
    it("should error with bad query", function () {
        return expect(testData.getStringColors("I2yXOkaDg6GqVGIbiN32dPo8apht7ZyABFdpNzJbxSTWQq6YGwbtdpso4zMhiss2")).to.be.rejected;
    });
});
