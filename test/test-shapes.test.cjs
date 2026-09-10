'use strict';

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

const { transform, inTest } = require('./helpers.cjs');

describe('shapes of the test callback', () => {
  const shapes = {
    'function expression': 'function (assert)',
    'async function expression': 'async function (assert)',
    'arrow function': '(assert) =>',
    'async arrow function': 'async (assert) =>',
    'arrow without parens': 'assert =>',
  };

  for (const [label, fn] of Object.entries(shapes)) {
    test(`${label} is handled`, () => {
      const body = fn.endsWith('=>')
        ? `assert.ok(value);`
        : `assert.ok(value);`;
      const source = fn.endsWith('=>')
        ? [
            "import { module, test } from 'qunit';",
            "module('demo', function () {",
            `  test('a case', ${fn} {`,
            `    ${body}`,
            '  });',
            '});',
          ].join('\n')
        : inTest(body, { fn });

      assert.ok(
        transform(source).includes('"assert.ok(value)"'),
        `expected injection for ${label}`,
      );
    });
  }

  test('a renamed assert parameter is handled', () => {
    const source = inTest('a.ok(value);', { fn: 'function (a)' });
    assert.ok(transform(source).includes('"a.ok(value)"'));
  });

  test('only the FIRST parameter counts as assert', () => {
    const source = [
      "import { module, test } from 'qunit';",
      "module('demo', function () {",
      "  test('a case', function (first, assert) {",
      '    assert.ok(value);',
      '  });',
      '});',
    ].join('\n');
    assert.ok(!transform(source).includes('"assert.ok(value)"'));
  });
});

describe('shapes of the test call itself', () => {
  const callees = [
    ['test', "test('a', function (assert) { assert.ok(v); })"],
    ['QUnit.test', "QUnit.test('a', function (assert) { assert.ok(v); })"],
    ['test.only', "test.only('a', function (assert) { assert.ok(v); })"],
    ['test.skip', "test.skip('a', function (assert) { assert.ok(v); })"],
    ['test.todo', "test.todo('a', function (assert) { assert.ok(v); })"],
  ];

  for (const [label, source] of callees) {
    test(`${label}() is handled`, () => {
      assert.ok(
        transform(source).includes('"assert.ok(v)"'),
        `expected injection for ${label}`,
      );
    });
  }

  test('an unrelated function call is not treated as a test', () => {
    const source = "notTest('a', function (assert) { assert.ok(v); })";
    assert.ok(!transform(source).includes('"assert.ok(v)"'));
  });
});

describe('nesting', () => {
  test('assertions in a nested callback inside a test are handled', () => {
    const source = inTest(
      ['[1, 2].forEach(function () {', '  assert.ok(value);', '});'].join('\n'),
    );
    assert.ok(transform(source).includes('"assert.ok(value)"'));
  });

  test('an inner test shadows the outer assert binding', () => {
    const source = [
      "import { module, test } from 'qunit';",
      "test('outer', function (outerAssert) {",
      "  test('inner', function (assert) {",
      '    assert.ok(value);',
      '  });',
      '  outerAssert.ok(other);',
      '});',
    ].join('\n');
    const code = transform(source);
    assert.ok(code.includes('"assert.ok(value)"'), 'inner assert injected');
    assert.ok(
      code.includes('"outerAssert.ok(other)"'),
      'outer assert injected',
    );
  });
});
