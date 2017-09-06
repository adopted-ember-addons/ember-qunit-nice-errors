/*eslint-env node*/
'use strict';

var Filter = require('broccoli-filter');
var transform = require('./transform-qunit-assertions');

function TestTransformFilter(inputNode, options) {
  this.options = options;
  Filter.call(this, inputNode, this.options);
}

TestTransformFilter.prototype = Object.create(Filter.prototype);
TestTransformFilter.prototype.constructor = TestTransformFilter;
TestTransformFilter.prototype.canProcessFile = function(relativePath) {
  return /-test\.js/.test(relativePath);
};
TestTransformFilter.prototype.processString = function(content, relativePath) {
  var transformOpts = {};

  if (this.options.showFileInfo) {
    transformOpts['file'] = relativePath;
  }

  if (this.options.completeExistingMessages) {
    transformOpts['completeExistingMessages'] = this.options.completeExistingMessages;
  }

  return transform(content, transformOpts);
};

module.exports = TestTransformFilter;
