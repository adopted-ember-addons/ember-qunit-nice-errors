'use strict';

const { relative } = require('node:path');

/**
 * Assertions this plugin knows how to describe, mapped to the number of
 * arguments that means "no message was passed".
 *
 * `assert.ok(value)`            -> 1 argument, no message
 * `assert.equal(actual, expected)` -> 2 arguments, no message
 */
const SUPPORTED_ASSERTIONS = Object.freeze({
  equal: 2,
  notEqual: 2,
  deepEqual: 2,
  notDeepEqual: 2,
  propEqual: 2,
  notPropEqual: 2,
  strictEqual: 2,
  notStrictEqual: 2,
  ok: 1,
  notOk: 1,
});

/** `test(...)`, `QUnit.test(...)`, `test.only(...)`, `test.skip(...)`, `test.todo(...)` */
const TEST_CALLEE_NAMES = new Set(['test', 'only', 'skip', 'todo']);

const DEFAULT_INCLUDE = [/-test\.(?:[cm]?[jt]sx?|g[jt]s)$/];

function toRegExpList(value, optionName) {
  if (value == null) return null;
  const list = Array.isArray(value) ? value : [value];
  return list.map((entry) => {
    if (entry instanceof RegExp) return entry;
    if (typeof entry === 'string') return new RegExp(entry);
    throw new TypeError(
      `ember-qunit-nice-errors: \`${optionName}\` entries must be a RegExp or string, got ${typeof entry}`,
    );
  });
}

function matchesAny(patterns, value) {
  return patterns.some((pattern) => pattern.test(value));
}

function isQUnitTestCall(callee, t) {
  if (t.isIdentifier(callee)) return callee.name === 'test';
  if (t.isMemberExpression(callee) && !callee.computed) {
    return t.isIdentifier(callee.property)
      ? TEST_CALLEE_NAMES.has(callee.property.name)
      : false;
  }
  return false;
}

/**
 * True when `name` resolves to the first parameter of a function passed to a
 * QUnit `test(...)` call — that is, the `assert` argument, whatever it is named.
 *
 * Resolving through Babel's scope, rather than tracking the most recently seen
 * `test()` call textually, means renamed parameters and arrow-function tests are
 * handled, and an unrelated local named `assert` is not.
 */
function isAssertBinding(path, name, t) {
  const binding = path.scope.getBinding(name);
  if (!binding || binding.kind !== 'param') return false;

  const fn = binding.scope.path;
  if (!fn.isFunction()) return false;
  if (fn.node.params[0] !== binding.identifier) return false;

  const parent = fn.parentPath;
  return Boolean(
    parent &&
    parent.isCallExpression() &&
    isQUnitTestCall(parent.node.callee, t),
  );
}

module.exports = function babelPluginQunitNiceErrors({ types: t }) {
  return {
    name: 'qunit-nice-errors',

    visitor: {
      CallExpression(path, state) {
        const {
          include,
          exclude,
          showFileInfo = false,
          completeExistingMessages = false,
        } = state.opts || {};

        const filename = state.filename || state.file.opts.filename || '';
        if (!filename) return;

        const includePatterns =
          toRegExpList(include, 'include') ?? DEFAULT_INCLUDE;
        if (!matchesAny(includePatterns, filename)) return;

        const excludePatterns = toRegExpList(exclude, 'exclude');
        if (excludePatterns && matchesAny(excludePatterns, filename)) return;

        const node = path.node;
        const callee = node.callee;

        // `assert.ok(...)` — a plain, non-computed member call
        if (!t.isMemberExpression(callee) || callee.computed) return;
        if (!t.isIdentifier(callee.property)) return;
        if (!t.isIdentifier(callee.object)) return;

        const arity = SUPPORTED_ASSERTIONS[callee.property.name];
        if (arity === undefined) return;

        const args = node.arguments;
        const missingMessage = args.length === arity;
        const hasMessage = args.length === arity + 1;

        // Nothing to do unless we are filling in a missing message, or were
        // explicitly asked to overwrite an existing one.
        if (!missingMessage && !(completeExistingMessages && hasMessage))
          return;

        // Spread would change the argument count's meaning entirely.
        if (args.some((arg) => t.isSpreadElement(arg))) return;

        if (!isAssertBinding(path, callee.object.name, t)) return;

        const { start, end } = node;
        if (typeof start !== 'number' || typeof end !== 'number') return;

        let message = state.file.code.slice(start, end);

        if (showFileInfo && node.loc) {
          const cwd = state.cwd || state.file.opts.cwd || process.cwd();
          const location = `${relative(cwd, filename)}:${node.loc.start.line}:${node.loc.start.column}`;
          message += ` at ${location}`;
        }

        if (missingMessage) {
          args.push(t.stringLiteral(message));
        } else {
          args[arity] = t.stringLiteral(message);
        }
      },
    },
  };
};

module.exports.SUPPORTED_ASSERTIONS = SUPPORTED_ASSERTIONS;
module.exports.DEFAULT_INCLUDE = DEFAULT_INCLUDE;
