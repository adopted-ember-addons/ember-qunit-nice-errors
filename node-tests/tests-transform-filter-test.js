'use strict';

var Filter = require('../lib/tests-transform-filter');
var assert = require('chai').assert;
var broccoliTestHelpers = require('broccoli-test-helpers');
var makeTestHelper = broccoliTestHelpers.makeTestHelper;
var cleanupBuilders = broccoliTestHelpers.cleanupBuilders;
var fs = require('fs');
var path = require('path');

describe('transform test files', function() {
  var build;

  beforeEach(function() {
    build = makeTestHelper({
      fixturePath: __dirname,
      subject: function(tree) {
        return new Filter(tree);
      }
    });
  }),

  afterEach(function() {
    cleanupBuilders();
  }),

  it('applies assertion tranformation to test files', function() {
    var original, transformed;
    var transformedFolder = 'fixtures/dummy-test-folder-transformed';

    return build('fixtures/dummy-test-folder').then(function(results) {
      files(results).forEach(function(file) {
        console.log(file);
        original = fs.readFileSync(path.join(results.directory, file), 'utf8');
        transformed = fs.readFileSync(path.join(__dirname, transformedFolder, file), 'utf8');

        assert.equal(original, transformed);
      });
    });
  });
});

function files(results) {
  return results.files.filter(function(str) { !/\/$/.test(str); });
}
