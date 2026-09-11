'use strict';

const { transformSync } = require('@babel/core');
const plugin = require('../src/index.cjs');

const DEFAULT_FILENAME = '/project/tests/unit/thing-test.js';

/**
 * Runs the plugin over `source` and returns the generated code.
 *
 * `configFile`/`babelrc` are disabled so a stray Babel config on the machine
 * running the tests cannot influence the result.
 */
function transform(source, { filename = DEFAULT_FILENAME, options, cwd } = {}) {
  const result = transformSync(source, {
    filename,
    cwd: cwd || '/project',
    configFile: false,
    babelrc: false,
    plugins: options === undefined ? [plugin] : [[plugin, options]],
  });

  return result.code;
}

/** Wraps `body` in a conventional QUnit test so tests below stay readable. */
function inTest(body, { fn = 'function (assert)' } = {}) {
  return [
    "import { module, test } from 'qunit';",
    "module('demo', function () {",
    `  test('a case', ${fn} {`,
    body
      .split('\n')
      .map((line) => `    ${line}`)
      .join('\n'),
    '  });',
    '});',
  ].join('\n');
}

/** Every string literal appearing in `code`, in source order. */
function stringLiterals(code) {
  return [...code.matchAll(/"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'/g)].map(
    (match) => match[1] ?? match[2],
  );
}

module.exports = { transform, inTest, stringLiterals, DEFAULT_FILENAME };
