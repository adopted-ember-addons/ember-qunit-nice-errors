'use strict';

const assert = require('chai').assert;
const fs = require('fs');
const recast = require('recast');
const transform = require('../../lib/transform-qunit-assertions');

describe('transform qunit assertions', function() {
  it('transforms ok assertions', function() {
    assertOutput('ok');
  });

  it('transforms notOk assertions', function() {
    assertOutput('not-ok');
  });

  it('transforms equal assertions', function() {
    assertOutput('equal');
  });

  it('transforms not-equal assertions', function() {
    assertOutput('not-equal');
  });

  it('adds file path and line number of assertion based on options', function() {
    assertOutput('with-file-line', true);
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

  it('transforms strict-equal assertions', function() {
    assertOutput('strict-equal');
  });

  it('transforms not-strict-equal assertions', function() {
    assertOutput('not-strict-equal');
  });
});

function prettify(source) {
  let ast = recast.parse(source);

  return recast.prettyPrint(ast).code;
}

function assertOutput(fileName, addFile) {
  let source = fs.readFileSync(`./node-tests/fixtures/original/unit/${fileName}.js`, 'utf8');
  let expected = fs.readFileSync(`./node-tests/fixtures/transformed/unit/${fileName}.js`, 'utf8');
  let options = addFile ? { file: `${fileName}.js` } : null;

  let transformedSource = transform(source, options);

  let prettyTransformedSource = prettify(transformedSource);
  let prettyTransformedExpected = prettify(expected);

  assert.equal(prettyTransformedExpected, prettyTransformedSource);
}

