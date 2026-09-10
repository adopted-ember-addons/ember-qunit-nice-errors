'use strict';

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

const { transform, inTest } = require('./helpers.cjs');
const { DEFAULT_INCLUDE } = require('../src/index.cjs');

describe('file matching (default include)', () => {
  const matching = [
    '/project/tests/unit/thing-test.js',
    '/project/tests/unit/thing-test.ts',
    '/project/tests/unit/thing-test.mjs',
    '/project/tests/unit/thing-test.cjs',
    '/project/tests/unit/thing-test.jsx',
    '/project/tests/unit/thing-test.tsx',
    '/project/tests/integration/thing-test.gjs',
    '/project/tests/integration/thing-test.gts',
  ];

  for (const filename of matching) {
    test(`transforms ${filename.split('/').pop()}`, () => {
      const code = transform(inTest('assert.ok(value);'), { filename });
      assert.ok(
        code.includes('"assert.ok(value)"'),
        `expected injection in ${filename}`,
      );
    });
  }

  const nonMatching = [
    '/project/app/components/thing.js',
    '/project/tests/helpers/setup.js',
    '/project/tests/unit/thing-testing.js',
    '/project/src/test.js',
  ];

  for (const filename of nonMatching) {
    test(`leaves ${filename.split('/').pop()} alone`, () => {
      const code = transform(inTest('assert.ok(value);'), { filename });
      assert.ok(
        !code.includes('"assert.ok(value)"'),
        `expected no injection in ${filename}`,
      );
    });
  }

  test('DEFAULT_INCLUDE is exported for consumers who want to extend it', () => {
    assert.ok(Array.isArray(DEFAULT_INCLUDE));
    assert.ok(DEFAULT_INCLUDE.every((entry) => entry instanceof RegExp));
  });
});

describe('include option', () => {
  test('accepts a RegExp', () => {
    const code = transform(inTest('assert.ok(value);'), {
      filename: '/project/spec/thing.spec.js',
      options: { include: /\.spec\.js$/ },
    });
    assert.ok(code.includes('"assert.ok(value)"'));
  });

  test('accepts a string, compiled to a RegExp', () => {
    const code = transform(inTest('assert.ok(value);'), {
      filename: '/project/spec/thing.spec.js',
      options: { include: '\\.spec\\.js$' },
    });
    assert.ok(code.includes('"assert.ok(value)"'));
  });

  test('accepts an array', () => {
    const options = { include: [/\.spec\.js$/, /-check\.js$/] };
    for (const filename of ['/p/a.spec.js', '/p/b-check.js']) {
      const code = transform(inTest('assert.ok(value);'), {
        filename,
        options,
      });
      assert.ok(code.includes('"assert.ok(value)"'), filename);
    }
  });

  test('replaces the default rather than adding to it', () => {
    const code = transform(inTest('assert.ok(value);'), {
      filename: '/project/tests/unit/thing-test.js',
      options: { include: /\.spec\.js$/ },
    });
    assert.ok(!code.includes('"assert.ok(value)"'));
  });

  test('rejects a nonsense entry with a helpful error', () => {
    assert.throws(
      () =>
        transform(inTest('assert.ok(value);'), {
          options: { include: [123] },
        }),
      /`include` entries must be a RegExp or string/,
    );
  });
});

describe('exclude option', () => {
  test('wins over include', () => {
    const code = transform(inTest('assert.ok(value);'), {
      filename: '/project/tests/unit/skip-me-test.js',
      options: { exclude: /skip-me/ },
    });
    assert.ok(!code.includes('"assert.ok(value)"'));
  });

  test('does not affect other files', () => {
    const code = transform(inTest('assert.ok(value);'), {
      filename: '/project/tests/unit/keep-test.js',
      options: { exclude: /skip-me/ },
    });
    assert.ok(code.includes('"assert.ok(value)"'));
  });
});

describe('showFileInfo option', () => {
  test('appends a path:line:column suffix relative to cwd', () => {
    const code = transform(inTest('assert.ok(value);'), {
      filename: '/project/tests/unit/thing-test.js',
      cwd: '/project',
      options: { showFileInfo: true },
    });
    assert.match(
      code,
      /assert\.ok\(value\) at tests\/unit\/thing-test\.js:\d+:\d+/,
    );
  });

  test('is off by default', () => {
    const code = transform(inTest('assert.ok(value);'));
    assert.ok(code.includes('"assert.ok(value)"'));
    assert.ok(!code.includes(' at '));
  });
});

describe('completeExistingMessages option', () => {
  test('overwrites an existing unary message', () => {
    const code = transform(inTest(`assert.ok(value, 'stale text');`), {
      options: { completeExistingMessages: true },
    });
    assert.ok(code.includes('"assert.ok(value, \'stale text\')"'));
    // the message was replaced in place, not appended: still two arguments
    assert.match(code, /assert\.ok\(value, "[^"]*"\)/);
  });

  test('overwrites an existing binary message', () => {
    const code = transform(inTest(`assert.equal(a, b, 'stale');`), {
      options: { completeExistingMessages: true },
    });
    assert.ok(code.includes('"assert.equal(a, b, \'stale\')"'));
  });

  test('is off by default', () => {
    const code = transform(inTest(`assert.ok(value, 'kept');`));
    assert.ok(code.includes("'kept'"));
  });
});
