var transform = require('../../../lib/transform-qunit-assertions');
var assert = require('chai').assert;

describe('transform qunit assertions', function() {
  it('transforms source to ok', function() {
    assert.equal(transform('source'), 'ok');
  });
});
