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

var googleImages = require("google-images");
var GetStringColors = rewire("../src/index");

require("dotenv-safe").load({
    path: "./test/.env",
    sample: "./test/.env.example"
});
var testDataDir = path.join(__dirname, "data");

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
    describe("Filtering image results", function () {
        var private_function = null;
        var data = null;
        beforeEach(function() {
            private_function = GetStringColors.__get__("filterResultsByImageType");
            data = [{
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
            }];
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
    describe("Reuesting an image search", function () {
        var private_function = null;
        var stub = null;
        beforeEach(function() {
            private_function = GetStringColors.__get__("requestImageSearch");
            stub = sinon.stub(googleImages(process.env.GOOGLE_CSE_ID, process.env.GOOGLE_API_KEY), "search");
        });
        it("should reach back to dependency", function () {
            private_function("spam");
            expect(stub).to.be.called;
        });
        afterEach(function() {
            stub.resetBehaviour();
        });
    });
    describe("Reuesting an image search", function () {
        var stub = null;
        before(function() {
            stub = sinon.stub(googleImages, "Client")
                .returns([{
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
                }]);
        });
        it("known url should get a buffer", function () {
            var promise = getStringColors.requestImageUrlAsBuffer("https://upload.wikimedia.org/wikipedia/commons/d/d6/Wikipedia-logo-v2-en.png");
            return Promise.all([
                expect(promise).to.eventually.be.instanceOf(Buffer),
                expect(promise).to.eventually.have.length.above(0)
            ]);
        });
        it("known bad url should reject", function () {
            return expect(getStringColors.requestImageUrlAsBuffer("http://tommilligan.github.io/does-not-exist/image.jpg")).to.be.rejected;
        });
        after(function() {
            stub.resetBehaviour();
        });
    });
    describe("Using getColorsFromJpgBuffer", function () {
        var getStringColors = null;
        beforeEach(function() {
            getStringColors = new GetStringColors(process.env.GOOGLE_CSE_ID, process.env.GOOGLE_API_KEY);
        });
        it("should return a chroma color object for a JPEG buffer", function () {
            var buffer = fs.readFileSync(path.join(testDataDir, "orange_ff6600.jpg"));
            var promise = getStringColors.getColorsFromJpgBuffer(buffer);
            return Promise.all([
                expect(promise).to.eventually.be.an("array"),
                expect(promise).to.eventually.satisfy(array => {
                    return array.every(item => {
                        return expect(item).to.be.an("object");
                    });
                }),
                expect(promise).to.eventually.have.lengthOf(5)
            ]);
        });
        it("should throw an error for a non-JPEG buffer", function () {
            return expect(getStringColors.getColorsFromJpgBuffer(new Buffer("I2yXOkaDg6GqVGIbiN32dPo8apht7ZyABFdpNzJbxSTWQq6YGwbtdpso4zMhiss2"))).to.be.rejectedWith("SOI not found");
        });
        it("should throw an error for an empty buffer", function () {
            return expect(getStringColors.getColorsFromJpgBuffer(new Buffer(""))).to.be.rejectedWith("SOI not found");
        });
    });
    describe("Using getStringColors", function () {
        var getStringColors = null;
        beforeEach(function() {
            getStringColors = new GetStringColors(process.env.GOOGLE_CSE_ID, process.env.GOOGLE_API_KEY);
        });
        it("should return a chroma color object from a valid search string", function () {
            var promise = getStringColors.getStringColors("dog");
            return Promise.all([
                expect(promise).to.eventually.be.an("array"),
                expect(promise).to.eventually.satisfy(array => {
                    return array.every(item => {
                        return expect(item).to.be.an("object");
                    });
                }),
                expect(promise).to.eventually.have.lengthOf(5)
            ]);
        });
    });
});
