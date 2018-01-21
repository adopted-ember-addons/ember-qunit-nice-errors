/*eslint-env node*/
'use strict';

var Filter = require('broccoli-persistent-filter');
var transform = require('./transform-qunit-assertions');
var path = require('path');

function TestTransformFilter(inputNode, options) {
  this.options = Object.assign({ persist: true }, options);
  Filter.call(this, inputNode, this.options);
}

TestTransformFilter.prototype = Object.create(Filter.prototype);
TestTransformFilter.prototype.constructor = TestTransformFilter;
TestTransformFilter.prototype.canProcessFile = function(relativePath) {
  return /-test\.js/.test(relativePath);
};

TestTransformFilter.prototype.baseDir = function() {
  return path.resolve(__dirname, '..');
}

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

TestTransformFilter.prototype.optionsHash = function() {
  if (!this._optionsHash) {
    this._optionsHash = JSON.stringify(this.options);
  }

  return this._optionsHash;
};

TestTransformFilter.prototype.cacheKeyProcessString = function(string, relativePath) {
  return Filter.prototype.cacheKeyProcessString.call(
    this, string + this.optionsHash(), relativePath
  );
};

module.exports = TestTransformFilter;
