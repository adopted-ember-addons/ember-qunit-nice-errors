/* jshint node: true */
'use strict';

const TestTransformFilter = require('./lib/tests-transform-filter');

module.exports = {
  name: 'ember-qunit-nice-errors',

  postprocessTree(type, tree) {
    if (type === 'test') {
      return new TestTransformFilter(tree);
    }
    return tree;
  }
};
