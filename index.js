/* jshint node: true */
'use strict';

var TestTransformFilter = require('./lib/tests-transform-filter');

module.exports = {
  name: 'ember-qunit-nice-errors',

  preprocessTree: function(type, tree) {
    if (type === 'test') {
      return new TestTransformFilter(tree);
    }
    return tree;
  }
};
