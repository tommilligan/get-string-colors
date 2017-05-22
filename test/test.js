const fs = require("fs");
const path = require("path");

const chai = require("chai");
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
        expect(GetStringColors).to.be.a("function");
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
    /*
    describe("Using requestJpgImageUrls", function () {
        var getStringColors = null;
        beforeEach(function() {
            getStringColors = new GetStringColors(process.env.GOOGLE_CSE_ID, process.env.GOOGLE_API_KEY);
        });
        it("known query should get an array of strings", function () {
            const promise = getStringColors.requestJpgImageUrls("sun");
            return Promise.all([
                expect(promise).to.eventually.be.an("array"),
                expect(promise).to.eventually.satisfy(array => {
                    return array.every(item => {
                        return expect(item).to.be.a("string");
                    });
                }),
                expect(promise).to.eventually.have.length.above(0)
            ]);
        });
        it("unknown query should get an array of length 0", function () {
            const promise = getStringColors.requestJpgImageUrls("9oTvo2EiXdtMLfBPJrSGG6u3wjH1OBasa1WRvnkyxQnBDylw2FTL6qI2cBBaXQ68");
            return Promise.all([
                expect(promise).to.eventually.be.an("array"),
                expect(promise).to.eventually.be.empty
            ]);
        });
    });
    */
    describe("Using requestImageUrlAsBuffer", function () {
        var getStringColors = null;
        beforeEach(function() {
            getStringColors = new GetStringColors(process.env.GOOGLE_CSE_ID, process.env.GOOGLE_API_KEY);
        });
        it("known url should get a buffer", function () {
            const promise = getStringColors.requestImageUrlAsBuffer("https://upload.wikimedia.org/wikipedia/commons/d/d6/Wikipedia-logo-v2-en.png");
            return Promise.all([
                expect(promise).to.eventually.be.instanceOf(Buffer),
                expect(promise).to.eventually.have.length.above(0)
            ]);
        });
    });
    describe("Using getColorsFromJpgBuffer", function () {
        var getStringColors = null;
        beforeEach(function() {
            getStringColors = new GetStringColors(process.env.GOOGLE_CSE_ID, process.env.GOOGLE_API_KEY);
        });
        it("should return a chroma color object for a JPEG buffer", function () {
            const buffer = fs.readFileSync(path.join(testDataDir, "orange_ff6600.jpg"));
            const promise = getStringColors.getColorsFromJpgBuffer(buffer);
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
            const promise = getStringColors.getStringColors("dog");
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

