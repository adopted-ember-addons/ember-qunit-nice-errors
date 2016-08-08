/*jshint node:true*/
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
  var transformOpts = this.options.showFileInfo ? { file: relativePath } : {};

  return transform(content, transformOpts);
};

module.exports = TestTransformFilter;
