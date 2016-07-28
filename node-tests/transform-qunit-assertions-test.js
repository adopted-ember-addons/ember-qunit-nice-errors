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
  var source = fs.readFileSync('./node-tests/fixtures/original/' + fileName + '.js', 'utf8');
  var transformed = fs.readFileSync('./node-tests/fixtures/transformed/' + fileName + '.js', 'utf8');

  var transformedSource = transform(source);

  var prettyTransformedSource = prettify(transformedSource);
  var prettyTransformedExpected = prettify(transformed);

  assert.equal(prettyTransformedExpected, prettyTransformedSource);
}

describe('transform qunit assertions', function() {
  it('transforms ok assertions', function() {
    assertOutput('ok');
  });

  it('transforms not-ok assertions', function() {
    assertOutput('not-ok');
  });

  it('transforms equal assertions', function() {
    assertOutput('equal');
  });

  it('transforms not-equal assertions', function() {
    assertOutput('not-equal');
  });

  it('transforms deep-equal assertions', function() {
    assertOutput('deep-equal');
  });

  it('transforms not-deep-equal assertions', function() {
    assertOutput('not-deep-equal');
  });

  it('transforms prop-equal assertions', function() {
    assertOutput('prop-equal');
  });

  it('transforms not-prop-equal assertions', function() {
    assertOutput('not-prop-equal');
  });
});
