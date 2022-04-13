'use strict';

import transform from '../lib/transform-qunit-assertions';
import { assert } from 'chai';
import { readFileSync } from 'fs';
import { parse, prettyPrint } from 'recast';

function prettify(source) {
  var ast = parse(source);
  return prettyPrint(ast).code;
}

function assertOutput(fileName, addFile) {
  fileName = fileName + '.js';
  var source = readFileSync(
    './node-tests/fixtures/original/unit/' + fileName,
    'utf8'
  );
  var transformed = readFileSync(
    './node-tests/fixtures/transformed/unit/' + fileName,
    'utf8'
  );
  var options = addFile ? { file: fileName } : null;

  var transformedSource = transform(source, options);

  var prettyTransformedSource = prettify(transformedSource);
  var prettyTransformedExpected = prettify(transformed);

  assert.equal(prettyTransformedExpected, prettyTransformedSource);
}

describe('transform qunit assertions', function () {
  it('transforms ok assertions', function () {
    assertOutput('ok');
  });

  it('transforms notOk assertions', function () {
    assertOutput('not-ok');
  });

  it('transforms equal assertions', function () {
    assertOutput('equal');
  });

  it('transforms not-equal assertions', function () {
    assertOutput('not-equal');
  });

  it('adds file path and line number of assertion based on options', function () {
    assertOutput('with-file-line', true);
  });

  it('transforms deep-equal assertions', function () {
    assertOutput('deep-equal');
  });

  it('transforms not-deep-equal assertions', function () {
    assertOutput('not-deep-equal');
  });

  it('transforms prop-equal assertions', function () {
    assertOutput('prop-equal');
  });

  it('transforms not-prop-equal assertions', function () {
    assertOutput('not-prop-equal');
  });

  it('transforms strict-equal assertions', function () {
    assertOutput('strict-equal');
  });

  it('transforms not-strict-equal assertions', function () {
    assertOutput('not-strict-equal');
  });
});
