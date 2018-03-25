'use strict';

var TestTransformer = require('./lib/tests-transformer');

module.exports = {
  name: 'ember-qunit-nice-errors',

  included: function(app) {
    this._super.included.apply(this, arguments);

    this.addonConfig =
      app.project.config(app.env)['ember-qunit-nice-errors'] || {};
  },

  preprocessTree: function(type, tree) {
    if (type === 'test') {
      return new TestTransformer(tree, this.addonConfig);
    }
    return tree;
  }
};
