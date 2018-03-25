'use strict';

const Filter = require('broccoli-persistent-filter');
const transform = require('./transform-qunit-assertions');
const any = require('./utils').any;
const path = require('path');
const minimatch = require('minimatch');

const defaults = {
  annotation: 'QUnit nice errors',
  completeExistingMessages: false,
  showFileInfo: false,
  include: ['**/*-test.js'],
  exclude: [],
  persist: true,
};

function TestTransformer(inputNode, options) {
  this.options = Object.assign({}, defaults, options);
  Filter.call(this, inputNode, {
    annotation: this.options.annotation,
    persist: this.options.persist
  });
}

TestTransformer.prototype = Object.create(Filter.prototype);
TestTransformer.prototype.constructor = TestTransformer;
TestTransformer.prototype.canProcessFile = function(relativePath) {
  let candidate = any(this.options.include, function(rule) {
    return minimatch(relativePath, rule);
  });

  if (candidate) {
    return !this.options.exclude.length ||
      !any(this.options.exclude, function(rule) {
        return minimatch(relativePath, rule);
      });
  }
};

TestTransformer.prototype.baseDir = function() {
  return path.resolve(__dirname, '..');
}

TestTransformer.prototype.processString = function(content, relativePath) {
  let transformOpts = {
    completeExistingMessages: this.options.completeExistingMessages
  };

  if (this.options.showFileInfo) {
    transformOpts['file'] = relativePath;
  }

  return transform(content, transformOpts);
};

TestTransformer.prototype.optionsHash = function() {
  if (!this._optionsHash) {
    this._optionsHash = JSON.stringify(this.options);
  }

  return this._optionsHash;
};

TestTransformer.prototype.cacheKeyProcessString = function(string, relativePath) {
  return Filter.prototype.cacheKeyProcessString.call(
    this, string + this.optionsHash(), relativePath
  );
};

module.exports = TestTransformer;
