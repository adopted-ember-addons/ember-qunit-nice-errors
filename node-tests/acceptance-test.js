/*eslint-env node, mocha*/
var assert = require('chai').assert;
var AddonTestApp = require('ember-cli-addon-tests').AddonTestApp;
var denodeify = require('denodeify');
var readFile = denodeify(require('fs').readFile);

describe('Acceptance', function() {
  this.timeout(300000);
  var app;

  before(function() {
    app = new AddonTestApp();
    return app.create('dummy', {
      fixturesPath: 'tests'
    }).then(function() {
      return app.runEmberCommand('build');
    });
  });

  it('transforms assertions on build', function() {
    return readFile(app.filePath('/dist/assets/tests.js'), 'utf8').then(function (data) {
      assert.include(data, "assert.ok(fooTruthy, 'assert.ok(fooTruthy)');");
      assert.include(data, "assert.notOk(!fooTruthy, 'assert.notOk(!fooTruthy)');");
      assert.include(data, "assert.equal(5 * 2, 2 * 5, 'assert.equal(5*2, 2*5)');");
    });
  });
});
