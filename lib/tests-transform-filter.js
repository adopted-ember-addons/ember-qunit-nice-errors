/*jshint node:true*/
'use strict';

const Filter = require('broccoli-filter');
const transform = require('./transform-qunit-assertions');

class TestTransformFilter extends Filter {
  canProcessFile(relativePath) {
    return relativePath.endsWith('-test.js');
  }

  processString(content) {
    return transform(content);
  }
}

module.exports = TestTransformFilter;
