'use strict';

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

const { transform, inTest } = require('./helpers.cjs');
const { SUPPORTED_ASSERTIONS } = require('../src/index.cjs');

describe('supported assertions', () => {
  for (const [name, arity] of Object.entries(SUPPORTED_ASSERTIONS)) {
    const args = arity === 1 ? 'value' : 'actual, expected';
    const call = `assert.${name}(${args})`;

    test(`${name} (${arity}-arg) gains its own source as the message`, () => {
      const code = transform(inTest(`${call};`));
      assert.match(
        code,
        new RegExp(`${name}\\(${args.replace(', ', ', ')}, "`),
      );
      assert.ok(
        code.includes(`"${call}"`),
        `expected message "${call}" in:\n${code}`,
      );
    });
  }
});

describe('assertions that already carry a message', () => {
  test('a unary assertion is left alone', () => {
    const source = inTest(`assert.ok(value, 'already explained');`);
    assert.equal(transform(source), transform(source));
    assert.ok(transform(source).includes("'already explained'"));
    assert.ok(!transform(source).includes('"assert.ok(value)"'));
  });

  test('a binary assertion is left alone', () => {
    const code = transform(inTest(`assert.equal(a, b, 'already explained');`));
    assert.ok(!code.includes('"assert.equal(a, b)"'));
  });
});

describe('unsupported assertions', () => {
  for (const call of [
    'assert.throws(fn)',
    'assert.step("x")',
    'assert.verifySteps([])',
    'assert.expect(1)',
    'assert.async()',
    'assert.timeout(100)',
  ]) {
    test(`${call} is untouched`, () => {
      const code = transform(inTest(`${call};`));
      assert.ok(
        !code.includes(`"${call}"`),
        `expected no injected message in:\n${code}`,
      );
    });
  }
});

describe('call shapes that must not be transformed', () => {
  test('computed member access', () => {
    const code = transform(inTest(`assert['ok'](value);`));
    assert.ok(!code.includes('assert.ok(value)"'));
  });

  test("an object that is not the test's assert parameter", () => {
    const code = transform(inTest(`notAssert.ok(value);`));
    assert.ok(!code.includes('"notAssert.ok(value)"'));
  });

  test('a same-named local that shadows nothing relevant', () => {
    const source = [
      "import { module, test } from 'qunit';",
      "module('demo', function () {",
      "  test('a case', function (assert) {",
      '    const helper = { ok() {} };',
      '    helper.ok(value);',
      '  });',
      '});',
    ].join('\n');
    assert.ok(!transform(source).includes('"helper.ok(value)"'));
  });

  test('an assert-like call outside any test()', () => {
    const source = [
      'function notATest(assert) {',
      '  assert.ok(value);',
      '}',
    ].join('\n');
    assert.ok(!transform(source).includes('"assert.ok(value)"'));
  });

  test('assert passed to a QUnit hook rather than a test', () => {
    const source = [
      "import { module } from 'qunit';",
      "module('demo', function (hooks) {",
      '  hooks.beforeEach(function (assert) {',
      '    assert.ok(value);',
      '  });',
      '});',
    ].join('\n');
    assert.ok(!transform(source).includes('"assert.ok(value)"'));
  });

  test('spread arguments (argument count is not meaningful)', () => {
    const code = transform(inTest(`assert.ok(...args);`));
    assert.ok(!code.includes('"assert.ok(...args)"'));
  });
});
