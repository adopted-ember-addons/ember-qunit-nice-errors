/*jshint node:true*/
'use strict';

var Filter = require('broccoli-filter');
var transform = require('./transform-qunit-assertions');

function TestTransformFilter(inputNode, options) {
  options = options || {};
  Filter.call(this, inputNode, options);
}

TestTransformFilter.prototype = Object.create(Filter.prototype);
TestTransformFilter.prototype.constructor = TestTransformFilter;
TestTransformFilter.prototype.canProcessFile = function(relativePath) {
  return /-test\.js/.test(relativePath);
};
TestTransformFilter.prototype.processString = function(content) {
  return transform(content);
};

module.exports = TestTransformFilter;
