'use strict';

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

const { transform, inTest } = require('./helpers.cjs');

describe('the injected message', () => {
  test('is the assertion source, verbatim', () => {
    const code = transform(inTest('assert.strictEqual(user.name, "Ada");'));
    assert.ok(code.includes('assert.strictEqual(user.name, \\"Ada\\")'));
  });

  test('preserves a multi-line assertion, including its newlines', () => {
    const source = inTest(
      ['assert.deepEqual(', '  actualThing,', '  expectedThing', ');'].join(
        '\n',
      ),
    );
    const code = transform(source);
    assert.match(code, /assert\.deepEqual\(\\n/);
  });

  test('preserves comments written inside the assertion', () => {
    const source = inTest('assert.ok(value /* why */);');
    assert.ok(transform(source).includes('assert.ok(value /* why */)'));
  });

  test('does not include the trailing semicolon', () => {
    const code = transform(inTest('assert.ok(value);'));
    assert.ok(code.includes('"assert.ok(value)"'));
    assert.ok(!code.includes('"assert.ok(value);"'));
  });
});

describe('idempotency', () => {
  test('running the plugin twice does not double-append', () => {
    const once = transform(inTest('assert.ok(value);'));
    const twice = transform(once, {
      filename: '/project/tests/unit/thing-test.js',
    });

    const count = (haystack, needle) => haystack.split(needle).length - 1;
    assert.equal(count(twice, '"assert.ok(value)"'), 1, `got:\n${twice}`);
  });

  test('is stable when completeExistingMessages keeps re-running', () => {
    const options = { completeExistingMessages: true };
    const once = transform(inTest('assert.ok(value);'), { options });
    const twice = transform(once, {
      filename: '/project/tests/unit/thing-test.js',
      options,
    });
    // The message now contains the previous message; the important property is
    // that the transform terminates and produces valid output rather than
    // corrupting the call.
    assert.match(twice, /assert\.ok\(\s*value/);
  });
});

describe('output validity', () => {
  test('transformed source still parses', () => {
    const { transformSync } = require('@babel/core');
    const code = transform(
      inTest(
        [
          'assert.ok(a);',
          'assert.equal(b, c);',
          `assert.deepEqual(d, e, 'kept');`,
          'assert.throws(fn);',
        ].join('\n'),
      ),
    );

    assert.doesNotThrow(() =>
      transformSync(code, {
        filename: '/project/tests/unit/thing-test.js',
        configFile: false,
        babelrc: false,
      }),
    );
  });

  test('untouched files come through unchanged in substance', () => {
    const source = 'export const value = 1;\n';
    const code = transform(source, { filename: '/project/app/thing.js' });
    assert.ok(code.includes('export const value = 1;'));
  });
});

describe('multiple assertions in one test', () => {
  test('each gets its own distinct message', () => {
    const code = transform(
      inTest(['assert.ok(first);', 'assert.ok(second);'].join('\n')),
    );
    assert.ok(code.includes('"assert.ok(first)"'));
    assert.ok(code.includes('"assert.ok(second)"'));
  });
});
