'use strict';

import Filter from '../lib/tests-transform-filter';
import { assert } from 'chai';
import {
  makeTestHelper as _makeTestHelper,
  cleanupBuilders as _cleanupBuilders,
} from 'broccoli-test-helpers';
var makeTestHelper = _makeTestHelper;
var cleanupBuilders = _cleanupBuilders;
import { readFileSync } from 'fs';
import { join } from 'path';
import { parse, prettyPrint } from 'recast';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('transform test files on build', function () {
  this.timeout(3000);

  var build = makeTestHelper({
    fixturePath: __dirname,
    subject: function (tree, options) {
      return new Filter(tree, options || {});
    },
  });

  afterEach(function () {
    return cleanupBuilders();
  }),
    it('transforms assertions', function () {
      return build('fixtures/original/integration/basic').then(function (
        results
      ) {
        assertBuild(results, 'fixtures/transformed/integration/basic');
      });
    });

  it('transforms assertions with file info option', function () {
    return build('fixtures/original/integration/with-file', {
      showFileInfo: true,
    }).then(function (results) {
      assertBuild(results, 'fixtures/transformed/integration/with-file');
    });
  });

  it('transforms assertions with complete existing messages option', function () {
    return build('fixtures/original/integration/completion-mode', {
      completeExistingMessages: true,
    }).then(function (results) {
      assertBuild(results, 'fixtures/transformed/integration/completion-mode');
    });
  });

  it('transforms assertions with complete existing messages and adds file and line number', function () {
    return build('fixtures/original/integration/completion-with-file', {
      showFileInfo: true,
      completeExistingMessages: true,
    }).then(function (results) {
      assertBuild(
        results,
        'fixtures/transformed/integration/completion-with-file'
      );
    });
  });

  it('ignores files with unsopported features or parse errors', function () {
    return build('fixtures/original/integration/unsupported-file').then(
      function (results) {
        assertBuild(
          results,
          'fixtures/original/integration/unsupported-file',
          true
        );
      }
    );
  });

  it('converts files that matches the default glob *-test.js', function () {
    return build('fixtures/original/integration/default-include').then(
      function (results) {
        assertBuild(
          results,
          'fixtures/transformed/integration/default-include'
        );
      }
    );
  });

  it('tranforms files that match the include conditions', function () {
    const include = ['*-foo.js', '*-bar.js'];

    return build('fixtures/original/integration/custom-include', {
      include,
    }).then(function (results) {
      assertBuild(results, 'fixtures/transformed/integration/custom-include');
    });
  });

  it('excludes files that match the ignore conditions', function () {
    const include = ['*-foo.js'];
    const exclude = ['ok-*.js'];

    return build('fixtures/original/integration/exclude', {
      include,
      exclude,
    }).then(function (results) {
      assertBuild(results, 'fixtures/transformed/integration/exclude');
    });
  });
});

function assertBuild(results, expectedFolder, exactMatch) {
  var actual, expected;

  files(results).forEach(function (file) {
    actual = readFileSync(join(results.directory, file), 'utf8');
    expected = readFileSync(join(__dirname, expectedFolder, file), 'utf8');

    try {
      if (exactMatch) {
        assert.equal(
          actual,
          expected,
          'Expected ' + file + ' to be transformed correctly'
        );
      } else {
        assert.equal(
          prettify(actual),
          prettify(expected),
          'Expected ' + file + ' to be transformed correctly'
        );
      }
    } catch (e) {
      // HACK: For some reason assert.equal is not showing the string diff on
      // error. This forces the mocha reporter to show the diff.
      e.showDiff = true;
      throw e;
    }
  });
}

function files(results) {
  return results.files.filter(function (str) {
    return !/\/$/.test(str);
  });
}

function prettify(source) {
  var ast = parse(source);
  return prettyPrint(ast).code;
}
