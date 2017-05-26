var fs = require("fs");
var path = require("path");

var chai = require("chai");
var expect = chai.expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var rewire = require("rewire");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
chai.use(sinonChai);
var sinonStubPromise = require("sinon-stub-promise");
sinonStubPromise(sinon);

var GoogleImages = require("google-images");
var GetStringColors = rewire("../src/index");

var testDataDir = path.join(__dirname, "data");

// Sample data

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
    "googleImages": new GoogleImages("CSE_ID", "API_KEY")
};


// Begin testing

describe("The GetStringColors factory function (default export)", function () {
    it("should be of type function", function () {
        expect(GetStringColors).to.be.a("function");
    });
    it("should error if no parameters", function() {
        expect(function () {
            GetStringColors(undefined, undefined);
        }).to.throw();
    });
    it("should error if no Google CSE ID", function() {
        expect(function () {
            GetStringColors(undefined, process.env.GOOGLE_API_KEY);
        }).to.throw();
    });
    it("should error if no Google API Key", function() {
        expect(function () {
            GetStringColors(process.env.GOOGLE_CSE_ID, undefined);
        }).to.throw();
    });
    it("should return a function if okay", function() {
        expect(function () {
            var getStringColors = GetStringColors(process.env.GOOGLE_CSE_ID, process.env.GOOGLE_API_KEY);
            expect(getStringColors).to.be.a("function");
        }).to.not.throw();
    });
});

describe("Module private functions", function () {
    describe("filterResultsByImageType", function () {
        var private_function = null;
        var data = null;
        beforeEach(function() {
            private_function = GetStringColors.__get__("filterResultsByImageType");
            data = testData.imageSearchResults;
        });
        it("should work for valid string types", function () {
            var filtered = private_function(data, "image/jpeg");
            expect(filtered).to.be.an("array");
            expect(filtered).to.have.lengthOf(1);
            expect(filtered[0].url).to.equal("http://foo.bar/baz.jpg");
        });
        it("if no results should return empty array", function () {
            var filtered = private_function(data, "holy/grail");
            expect(filtered).to.be.an("array");
            expect(filtered).to.be.empty;
        });
    });
    describe("processResultsToUrl", function () {
        var private_function = null;
        var data = null;
        beforeEach(function() {
            private_function = GetStringColors.__get__("processResultsToUrl");
            data = testData.imageSearchResults;
        });
        it("should work for valid string types", function () {
            var filtered = private_function(data, "image/jpeg");
            expect(filtered).to.be.a("string");
            expect(filtered).to.equal("http://foo.bar/baz.jpg");
        });
        it("if no results should throw error", function () {
            expect(function () {
                private_function(data, "holy/grail");
            }).to.throw();
        });
    });
});

describe("Agnostic wrappers for external dependencies", function () {
    describe("requestImageSearch", function () {
        var private_function = null;
        var stub = null;
        var googleImages = testData.googleImages;
        beforeEach(function() {
            private_function = GetStringColors.__get__("requestImageSearch");
            stub = sinon.stub(googleImages, "search").callsFake(() => { return testData.imageSearchResults; });
        });
        it("should use provided google-images search method", function () {
            private_function(googleImages, "spam");
            expect(stub).to.be.calledWith("spam");
        });
        it("should return search results unchanged", function () {
            var results = private_function(googleImages, "spam");
            expect(results).to.be.equal(testData.imageSearchResults);
        });
        afterEach(function() {
            stub.restore();
        });
    });
});