# Migrating from v2 to v3

v3 is the same idea delivered differently: a **Babel plugin** instead of an ember-cli addon.

There are two breaking changes:

1. **It must be added to your Babel config.** Installing it is no longer enough.
2. **Node 22 or above is required.**

**The one thing you must not miss** is the first. v2 worked the moment it was installed; v3 does not. If you upgrade without adding it to your Babel config, nothing errors — your assertions simply stop getting messages, and you find out the next time a test fails and tells you nothing useful.

## Why it changed

v2 worked by hooking ember-cli's `preprocessTree('test', …)` and running a `broccoli-persistent-filter` over your test tree.

That hook does not exist in the Embroider **v2 addon format**, and it never fires in a **Vite**-built app. So on a modern Ember build v2 was already silently inert — installed, resolved, and transforming nothing.

A Babel plugin runs in both pipelines, which is the only way to keep this working going forward. It also stops being Ember-specific: any QUnit suite compiled with Babel can use it.

## Node 22+

Node 20 reached end-of-life on 2026-04-30 and no longer receives security patches, so it is no longer supported. `engines` is now `>= 22`.

If you are still on Node 20, upgrade the runtime first — that part is unrelated to this package and worth doing on its own.

## What to change

### 1. Add it to your Babel config

**Vite / Embroider**

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

**Classic ember-cli**

```js
// ember-cli-build.js
const app = new EmberApp(defaults, {
  babel: {
    plugins: [require.resolve('ember-qunit-nice-errors')],
  },
});
```

Addons and engines take the same option in their `index.js` / `ember-cli-build.js`.

### 2. Move your configuration

Configuration moves out of `config/environment.js` and into the plugin's own options.

**Before**

```js
// config/environment.js
module.exports = function (environment) {
  return {
    'ember-qunit-nice-errors': {
      include: ['**/*-test.js'],
      exclude: ['**/vendor/**'],
      showFileInfo: true,
      completeExistingMessages: false,
    },
  };
};
```

**After**

```js
// babel.config.mjs
import qunitNiceErrors from 'ember-qunit-nice-errors';

export default {
  plugins: [
    [
      qunitNiceErrors,
      {
        include: [/-test\.js$/],
        exclude: [/vendor/],
        showFileInfo: true,
      },
    ],
  ],
};
```

Remove the `'ember-qunit-nice-errors'` block from `config/environment.js` — it is no longer read.

### 3. Convert globs to regular expressions

`include` and `exclude` were **minimatch globs**. They are now **regular expressions** (or strings compiled with `new RegExp(...)`).

| v2 glob               | v3 regular expression    |
| --------------------- | ------------------------ |
| `**/*-test.js`        | `/-test\.js$/`           |
| `**/vendor/**`        | `/vendor/`               |
| `**/*-{test,spec}.js` | `/-(?:test\|spec)\.js$/` |

If you only ever used the default, you can drop the option entirely — the default now covers `*-test.{js,jsx,ts,tsx,mjs,cjs,gjs,gts}`.

To extend the default rather than replace it:

```js
import qunitNiceErrors, { DEFAULT_INCLUDE } from 'ember-qunit-nice-errors';

[qunitNiceErrors, { include: [...DEFAULT_INCLUDE, /\.spec\.js$/] }];
```

### 4. Options that are gone

| v2 option    | status                                                                                   |
| ------------ | ---------------------------------------------------------------------------------------- |
| `annotation` | Removed. It named the broccoli node in build output; there is no broccoli node any more. |
| `persist`    | Removed. It controlled broccoli's persistent cache; Babel does its own caching.          |

`showFileInfo` and `completeExistingMessages` are unchanged in meaning.

## Verifying it actually runs

Because failure is silent, check the built output rather than assuming. The message is the assertion's own source, so grep a build for it:

```sh
# note: bundlers commonly emit these as template literals, so search backticks too
grep -rhoE "[\"'\`]assert\.[a-zA-Z]+\([^\"'\`]{0,60}[\"'\`]" dist/assets/*.js | head
```

Or write a deliberately failing message-less assertion and confirm the reported message is the assertion source.

## What you gain

v3 catches cases v2 silently skipped, because it resolves `assert` through Babel's scope instead of tracking the most recently seen `test()` call and matching only `FunctionExpression`:

| case                                    | v2                  | v3  |
| --------------------------------------- | ------------------- | --- |
| `test('x', function (assert) { … })`    | ✅                  | ✅  |
| `test('x', async (assert) => { … })`    | ❌ silently skipped | ✅  |
| `test('x', function (a) { a.ok(v); })`  | fragile             | ✅  |
| `test.only` / `test.skip` / `test.todo` | ❌                  | ✅  |

If your suite uses arrow-function tests, expect assertions that previously had no message to start reporting one. That is the fix working — but it does change what appears in CI output.

Conversely, v3 is **stricter** about what counts as an assertion. An `assert` that is not a test callback's first parameter — for example one passed to `hooks.beforeEach` — is no longer transformed. v2 would sometimes transform these by accident.
