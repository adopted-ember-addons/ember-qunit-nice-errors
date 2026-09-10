# ember-qunit-nice-errors

[![CI](https://github.com/adopted-ember-addons/ember-qunit-nice-errors/actions/workflows/ci.yml/badge.svg)](https://github.com/adopted-ember-addons/ember-qunit-nice-errors/actions/workflows/ci.yml)

Because _expected true, result false_ is not enough.

Gives message-less QUnit assertions a message: their own source text.

```js
// you write
assert.ok(user.isActive);

// it compiles to
assert.ok(user.isActive, 'assert.ok(user.isActive)');
```

So a failure reports

```
assert.ok(user.isActive)
```

instead of

```
failed, expected argument to be truthy
```

Only assertions **without** a message are touched. Anything you wrote yourself is left alone.

> **Upgrading from v1?** v2 is a Babel plugin rather than an ember-cli addon, and it needs one line of configuration — installing it is no longer enough. See [MIGRATION.md](./MIGRATION.md).

## Installation

```sh
pnpm add --save-dev ember-qunit-nice-errors
```

Then add it to your Babel config. **This step is required** — the plugin does nothing until you do.

### Vite / Embroider

```js
// babel.config.mjs
import qunitNiceErrors from 'ember-qunit-nice-errors';

export default {
  plugins: [
    qunitNiceErrors,
    // ...your other plugins
  ],
};
```

### Classic ember-cli builds

```js
// ember-cli-build.js
const app = new EmberApp(defaults, {
  babel: {
    plugins: [require.resolve('ember-qunit-nice-errors')],
  },
});
```

The same works in an addon's `index.js` and in an engine's `ember-cli-build.js`.

## Compatibility

- `@babel/core` 7 or 8
- Node.js 20.13+ or 22+

There is no longer an Ember version requirement — this is a plain Babel plugin. It works under Vite, Embroider and classic builds alike, and in any QUnit suite that runs through Babel.

## Options

| option                     | type                        | default                                | meaning                                                                               |
| -------------------------- | --------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------- |
| `include`                  | `RegExp \| string \| Array` | `[/-test\.(?:[cm]?[jt]sx?\|g[jt]s)$/]` | Which filenames to transform. **Replaces** the default rather than extending it.      |
| `exclude`                  | `RegExp \| string \| Array` | —                                      | Filenames to skip. Takes precedence over `include`.                                   |
| `showFileInfo`             | `boolean`                   | `false`                                | Append ` at <path>:<line>:<column>`, relative to Babel's `cwd`.                       |
| `completeExistingMessages` | `boolean`                   | `false`                                | Also overwrite messages you wrote yourself. Off by default, and rarely what you want. |

Strings are compiled with `new RegExp(...)`, so escape accordingly (`'\\.spec\\.js$'`).

```js
[
  'ember-qunit-nice-errors',
  {
    include: [/\.spec\.js$/],
    exclude: [/vendor/],
    showFileInfo: true,
  },
];
```

The default pattern is exported if you would rather extend it than replace it:

```js
const { DEFAULT_INCLUDE } = require('ember-qunit-nice-errors');

['ember-qunit-nice-errors', { include: [...DEFAULT_INCLUDE, /\.spec\.js$/] }];
```

> In v1 `include` and `exclude` were globs read from `config/environment.js`. They are now regular expressions passed as plugin options — see [MIGRATION.md](./MIGRATION.md).

## Which assertions

`ok`, `notOk`, `equal`, `notEqual`, `strictEqual`, `notStrictEqual`, `deepEqual`, `notDeepEqual`, `propEqual`, `notPropEqual`.

Assertions whose failure output is already descriptive — `throws`, `step`, `verifySteps`, `expect`, `async`, `timeout` — are deliberately left alone.

## How it decides what is an assertion

It resolves the `assert` object through Babel's scope rather than matching the identifier by name. A call is transformed only when its object is the **first parameter of a function passed to a QUnit `test()`** — including `QUnit.test`, `test.only`, `test.skip` and `test.todo`.

That means:

- renamed parameters work — `test('x', function (a) { a.ok(v); })`
- arrow-function tests work — `test('x', async (assert) => { … })`
- an unrelated local called `assert` is **not** transformed
- an `assert` passed to `hooks.beforeEach` is **not** transformed, because it is not a test callback

The last two were gaps in v1, which tracked the most recently seen `test()` call textually and only matched `FunctionExpression`.

It is also idempotent: a call is only matched when its argument count says no message was passed, so re-running the transform cannot append twice.

## Development

```sh
pnpm install
pnpm test          # node --test
pnpm run lint
pnpm run lint:fix
```

## License

MIT
