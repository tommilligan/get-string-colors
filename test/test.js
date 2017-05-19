
const getStringColors = require('../src/index');
const assert = require('chai').assert;

describe('Always', function() {
  describe('pass', function() {
    it('1 should equal 1', function() {
      assert.equal(1, 1);
    });
    it('always_true should return true', function() {
      assert.isTrue(getStringColors())
    });
  });
});