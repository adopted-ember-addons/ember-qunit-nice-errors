var transform = require('../../../lib/transform-qunit-assertions');
var assert = require('chai').assert;
var fs = require('fs');

describe('transform qunit assertions', function() {
  it('transforms: adds message to ok assertion without message', function() {
    var source = fs.readFileSync('./tests/fixtures/original/ok.js', 'utf8');
    var transformed = fs.readFileSync('./tests/fixtures/transformed/ok.js', 'utf8');

    assert.equal(transform(source), transformed);
  });
});
