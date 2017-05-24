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
/*
describe("Using external resources", function () {
    describe("Using external image search", function () {
        var getStringColors = null;
        beforeEach(function() {
            getStringColors = GetStringColors(process.env.GOOGLE_CSE_ID, process.env.GOOGLE_API_KEY);
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
    describe("Using external color determination", function () {
        var getStringColors = null;
        beforeEach(function() {
            getStringColors = new GetStringColors(process.env.GOOGLE_CSE_ID, process.env.GOOGLE_API_KEY);
        });
        it("should return known color", function () {
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
*/
describe("Live end-to-end test", function () {
    var getStringColors = null;
    beforeEach(function() {
        getStringColors = GetStringColors(process.env.GOOGLE_CSE_ID, process.env.GOOGLE_API_KEY);
    });
    it("should succeed with good query", function () {
        const promise = getStringColors("heart");
        return Promise.all([
            expect(promise).to.eventually.be.an("array"),
            expect(promise).to.eventually.satisfy(array => {
                return array.every(item => {
                    return expect(item).to.be.an("object");
                });
            }),
            expect(promise).to.eventually.satisfy(array => {
                return array.every(item => {
                    return expect(item).to.be.instanceOf("chromajsthingy");
                });
            }),
            expect(promise).to.eventually.have.lengthOf(5)
        ]);
    });
    it("should error with bad query", function () {
        return expect(getStringColors("I2yXOkaDg6GqVGIbiN32dPo8apht7ZyABFdpNzJbxSTWQq6YGwbtdpso4zMhiss2")).to.be.rejected;
    });
});
