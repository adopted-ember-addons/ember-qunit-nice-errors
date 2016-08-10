'use strict';

var Filter = require('../lib/tests-transform-filter');
var assert = require('chai').assert;
var broccoliTestHelpers = require('broccoli-test-helpers');
var makeTestHelper = broccoliTestHelpers.makeTestHelper;
var cleanupBuilders = broccoliTestHelpers.cleanupBuilders;
var fs = require('fs');
var path = require('path');
var recast = require('recast');

describe('transform test files on build', function() {
  var build;

  beforeEach(function() {
    build = makeTestHelper({
      fixturePath: __dirname,
      subject: function(tree, options) {
        return new Filter(tree, options || {});
      }
    });
  }),

  afterEach(function() {
    cleanupBuilders();
  }),

  it('transforms assertions', function() {
    return build('fixtures/original/integration/basic').then(function(results) {
      assertBuild(results, 'fixtures/transformed/integration/basic');
    });
  });

  it('transforms assertions with file info option', function() {
    return build('fixtures/original/integration/with-file', { showFileInfo: true }).then(function(results) {
      assertBuild(results, 'fixtures/transformed/integration/with-file');
    });
  });

  it('transforms assertions with complete existing messages option', function() {
    return build('fixtures/original/integration/completion-mode', { completeExistingMessages: true }).then(function(results) {
      assertBuild(results, 'fixtures/transformed/integration/completion-mode');
    });
  });

  it('transforms assertions with complete existing messages and adds file and line number', function() {
    return build('fixtures/original/integration/completion-with-file', { showFileInfo: true, completeExistingMessages: true }).then(function(results) {
      assertBuild(results, 'fixtures/transformed/integration/completion-with-file');
    });
  });
});

function assertBuild(results, transformedFolder) {
  var original, transformed;

  files(results).forEach(function(file) {
    original = fs.readFileSync(path.join(results.directory, file), 'utf8');
    transformed = fs.readFileSync(path.join(__dirname, transformedFolder, file), 'utf8');

    assert.equal(prettify(original), prettify(transformed));
  });
}

function files(results) {
  return results.files.filter(function(str) { return !/\/$/.test(str); });
}

function prettify(source) {
  var ast = recast.parse(source);
  return recast.prettyPrint(ast).code;
}
