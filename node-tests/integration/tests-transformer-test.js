'use strict';

const Filter = require('../../lib/tests-transformer');
const assert = require('chai').assert;
const broccoliTestHelpers = require('broccoli-test-helpers');
const makeTestHelper = broccoliTestHelpers.makeTestHelper;
const cleanupBuilders = broccoliTestHelpers.cleanupBuilders;
const fs = require('fs');
const path = require('path');
const recast = require('recast');

describe('transform test files on build', function() {
  this.timeout(3000);

  let build = makeTestHelper({
    fixturePath: __dirname,
    subject: function(tree, options) {
      return new Filter(tree, options || {});
    }
  });

  afterEach(function() {
    return cleanupBuilders();
  }),

  it('transforms assertions', function() {
    return build(originalFixture('basic')).then((results) => {
      assertBuild(results, transformedFixture('basic'));
    });
  });

  it('transforms assertions with file info option', function() {
    return build(originalFixture('with-file'), { showFileInfo: true }).then((results) => {
      assertBuild(results, transformedFixture('with-file'));
    });
  });

  it('transforms assertions with complete existing messages option', function() {
    return build(originalFixture('completion-mode'), { completeExistingMessages: true }).then((results) => {
      assertBuild(results, transformedFixture('completion-mode'));
    });
  });

  it('transforms assertions with complete existing messages and adds file and line number', function() {
    return build(originalFixture('completion-with-file'), { showFileInfo: true, completeExistingMessages: true }).then((results) => {
      assertBuild(results, transformedFixture('completion-with-file'));
    });
  });

  it('ignores files with unsopported features or parse errors', function() {
    return build(originalFixture('unsupported-file')).then((results) => {
      assertBuild(results, originalFixture('unsupported-file'), true);
    });
  });

  it('converts files that matches the default glob *-test.js', function() {
    return build(originalFixture('default-include')).then((results) => {
      assertBuild(results, transformedFixture('default-include'));
    });
  });

  it('tranforms files that match the include conditions', function() {
    const include = ['*-foo.js', '*-bar.js'];

    return build(originalFixture('custom-include'), { include }).then((results) => {
      assertBuild(results, transformedFixture('custom-include'));
    });
  });

  it('excludes files that match the ignore conditions', function() {
    const include = ['*-foo.js'];
    const exclude = ['ok-*.js'];

    return build(originalFixture('exclude'), { include, exclude }).then((results) => {
      assertBuild(results, transformedFixture('exclude'));
    });
  });
});

function assertBuild(results, expectedFolder, exactMatch) {
  let actual, expected;

  files(results).forEach(function(file) {
    actual = fs.readFileSync(path.join(results.directory, file), 'utf8');
    expected = fs.readFileSync(path.join(__dirname, expectedFolder, file), 'utf8');

    try {
      if (exactMatch) {
        assert.equal(actual, expected, `Expected ${file} to be transformed correctly`);
      } else {
        assert.equal(prettify(actual), prettify(expected), "Expected " + file + " to be transformed correctly");
      }
    } catch(e) {
      // HACK: For some reason assert.equal is not showing the string diff on
      // error. This forces the mocha reporter to show the diff.
      e.showDiff = true;
      throw e;
    }
  });
}

function files(results) {
  return results.files.filter((str) => { return !/\/$/.test(str); });
}

function prettify(source) {
  let ast = recast.parse(source);
  return recast.prettyPrint(ast).code;
}

function originalFixture(name) {
  return `../fixtures/original/integration/${name}`
}

function transformedFixture(name) {
  return `../fixtures/transformed/integration/${name}`
}
