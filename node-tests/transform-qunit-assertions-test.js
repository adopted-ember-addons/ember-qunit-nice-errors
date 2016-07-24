'use strict';

var transform = require('../lib/transform-qunit-assertions');
var assert = require('chai').assert;
var fs = require('fs');
var recast = require('recast');

function prettify(source) {
  var ast = recast.parse(source);
  return recast.prettyPrint(ast).code;
}

function assertOutput(fileName, addFile) {
  var source = fs.readFileSync('./node-tests/fixtures/original/unit/' + fileName, 'utf8');
  var transformed = fs.readFileSync('./node-tests/fixtures/transformed/unit/' + fileName, 'utf8');
  var options = addFile ? { file: fileName } : null;

  var transformedSource = transform(source, options);

  var prettyTransformedSource = prettify(transformedSource);
  var prettyTransformedExpected = prettify(transformed);

  assert.equal(prettyTransformedExpected, prettyTransformedSource);
}

describe('transform qunit assertions', function() {
  it('transforms ok assertions', function() {
    assertOutput('ok.js');
  });

  it('transforms notOk assertions', function() {
    assertOutput('not-ok.js');
  });

  it('transforms equal assertions', function() {
    assertOutput('equal.js');
  });

  it('transforms not-equal assertions', function() {
    assertOutput('not-equal.js');
  });

  it('adds file path and line number of assertion based on options', function() {
    assertOutput('with-file-line.js', true);
  });
});
