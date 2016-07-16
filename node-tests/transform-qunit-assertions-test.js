'use strict';

var transform = require('../lib/transform-qunit-assertions');
var assert = require('chai').assert;
var fs = require('fs');
var recast = require('recast');

function prettify(source) {
  var ast = recast.parse(source);
  return recast.prettyPrint(ast).code;
}

function assertOutput(fileName) {
  var source = fs.readFileSync('./node-tests/fixtures/original/' + fileName, 'utf8');
  var transformed = fs.readFileSync('./node-tests/fixtures/transformed/' + fileName, 'utf8');

  var transformedSource = transform(fileName, source);

  var prettyTransformedSource = prettify(transformedSource);
  var prettyTransformedExpected = prettify(transformed);

  assert.equal(prettyTransformedExpected, prettyTransformedSource);
}

describe('transform qunit assertions', function() {
  it('transforms: adds message to ok assertion without message', function() {
    assertOutput('ok.js');
  });

  it('transforms: adds message to notOk assertion without message', function() {
    assertOutput('not-ok.js');
  });

  it('transforms: adds message to equal assertion without message', function() {
    assertOutput('equal.js');
  });
});
