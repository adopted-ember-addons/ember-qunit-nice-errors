'use strict';

var transform = require('../lib/transform-qunit-assertions');
var assert = require('chai').assert;
var fs = require('fs');

function assertOutput(fileName) {
  var source = fs.readFileSync('./node-tests/fixtures/original/' + fileName + '.js', 'utf8');
  var transformed = fs.readFileSync('./node-tests/fixtures/transformed/' + fileName + '.js', 'utf8');

  assert.equal(transform(source), transformed);
}

describe('transform qunit assertions', function() {
  it('transforms: adds message to ok assertion without message', function() {
    assertOutput('ok');
  });

  it('transforms: adds message to notOk assertion without message', function() {
    assertOutput('not-ok');
  });
});
