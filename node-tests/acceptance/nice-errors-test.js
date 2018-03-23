'use strict';

const assert = require('chai').assert;
const AddonTestApp = require('ember-cli-addon-tests').AddonTestApp;
const denodeify = require('denodeify');
const readFile = denodeify(require('fs').readFile);

describe('Acceptance', function() {
  this.timeout(500000);
  let app;

  before(() => {
    app = new AddonTestApp();
    return app.create('dummy', {
      fixturesPath: 'tests'
    }).then(() => {
      return app.runEmberCommand('build');
    });
  });

  it('transforms assertions on build', function() {
    return readFile(app.filePath('/dist/assets/tests.js'), 'utf8').then((data) => {
      assert.include(data, "assert.ok(fooTruthy, 'assert.ok(fooTruthy)');");
      assert.include(data, "assert.notOk(!fooTruthy, 'assert.notOk(!fooTruthy)');");
      assert.include(data, "assert.equal(5 * 2, 2 * 5, 'assert.equal(5*2, 2*5)');");
    });
  });
});
