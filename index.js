/* eslint-env node */
'use strict';

module.exports = {
  name: 'ember-qunit-nice-errors',

  included: function(app) {
    this._super.included.apply(this, arguments);

    app.options = app.options || {};
    app.options.babel = app.options.babel || {};
    app.options.babel.plugins = app.options.babel.plugins || [];

    var transformPlugin = require('./lib/transform-assertions-plugin');
    this.addonConfig =
      app.project.config(app.env)['ember-qunit-nice-errors'] || {};

    app.options.babel.plugins.push(transformPlugin(this.addonConfig));
  }
};
