'use strict';

import { call, prototype } from 'broccoli-persistent-filter';
import transform from './transform-qunit-assertions';
import { resolve } from 'path';
import minimatch from 'minimatch';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

var defaults = {
  annotation: 'QUnit nice errors',
  completeExistingMessages: false,
  showFileInfo: false,
  include: ['**/*-test.js'],
  exclude: [],
  persist: true,
};

function TestTransformFilter(inputNode, options) {
  this.options = Object.assign({}, defaults, options);
  call(this, inputNode, {
    annotation: this.options.annotation,
    persist: this.options.persist,
  });
}

TestTransformFilter.prototype = Object.create(prototype);
TestTransformFilter.prototype.constructor = TestTransformFilter;
TestTransformFilter.prototype.canProcessFile = function (relativePath) {
  var candidate = any(this.options.include, function (rule) {
    return minimatch(relativePath, rule);
  });

  if (candidate) {
    return (
      !this.options.exclude.length ||
      !any(this.options.exclude, function (rule) {
        return minimatch(relativePath, rule);
      })
    );
  }
};

TestTransformFilter.prototype.baseDir = function () {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  return resolve(__dirname, '..');
};

TestTransformFilter.prototype.processString = function (content, relativePath) {
  var transformOpts = {};

  if (this.options.showFileInfo) {
    transformOpts['file'] = relativePath;
  }

  if (this.options.completeExistingMessages) {
    transformOpts['completeExistingMessages'] =
      this.options.completeExistingMessages;
  }

  return transform(content, transformOpts);
};

TestTransformFilter.prototype.optionsHash = function () {
  if (!this._optionsHash) {
    this._optionsHash = JSON.stringify(this.options);
  }

  return this._optionsHash;
};

TestTransformFilter.prototype.cacheKeyProcessString = function (
  string,
  relativePath
) {
  return prototype.cacheKeyProcessString.call(
    this,
    string + this.optionsHash(),
    relativePath
  );
};

function any(array, fun) {
  for (var i = 0; i < array.length; i++) {
    if (fun.call(null, array[i])) {
      return true;
    }
  }

  return false;
}

export default TestTransformFilter;
