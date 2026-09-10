# How To Contribute

## Installation

- `git clone <repository-url>`
- `cd ember-qunit-nice-errors`
- `pnpm install`

## Linting

- `pnpm lint` — ESLint and Prettier
- `pnpm lint:fix` — fix what can be fixed automatically

## Running tests

- `pnpm test` — runs the suite with Node's built-in test runner
- `pnpm test:watch` — re-runs on change

The tests exercise the plugin directly through `@babel/core`, so there is no
browser, dummy application, or Ember installation involved. CI additionally runs
the suite on Node 22/24/26 and against `@babel/core` 7 to keep the lower bound of
the peer range honest.

## Adding a test

`test/helpers.cjs` provides `transform(source, { filename, options, cwd })` and
`inTest(body)`, which wraps a snippet in a conventional QUnit test so the
assertions under test resolve their `assert` binding the way real code does.
