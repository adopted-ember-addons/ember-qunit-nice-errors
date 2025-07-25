'use strict';

var TestTransformFilter = require('./lib/tests-transform-filter');

module.exports = {
  name: require('./package').name,

  included(app) {
    this._super.included.apply(this, arguments);

    this.addonConfig =
      app.project.config(app.env)['ember-qunit-nice-errors'] || {};
  },

  preprocessTree(type, tree) {
    if (type === 'test') {
      return new TestTransformFilter(tree, this.addonConfig);
    }
    return tree;
  },
};
