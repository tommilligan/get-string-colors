
const getStringColors = require('../src/index');
const assert = require('chai').assert;

describe('Always', function() {
  describe('pass', function() {
    it('1 should equal 1', function() {
      assert.equal(1, 1);
    });
  });
});

describe('Module exports', function() {
  describe('Default export', function() {
    it('should be of type function', function() {
      assert.isType(getStringColors, Function);
    });
    it('should return a promise', function() {
      assert.isTrue(getStringColors())
    });
  });
});