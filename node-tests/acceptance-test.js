/*eslint-env node, mocha*/
var assert = require('chai').assert;
var exec = require('child_process').exec;
var fs = require('fs');

describe('Acceptance', function() {
  it('transforms assertions on build', function(done) {
    this.timeout(300000);

    exec('ember build', function(_, stdout) {
      assert.include(stdout, 'Built project successfully. Stored in "dist/".');

      fs.readFile('./dist/assets/tests.js', 'utf8', function(err, data) {
        if (err) {
          throw err;
        }

        assert.include(data, "assert.ok(fooTruthy, 'assert.ok(fooTruthy)');");
        assert.include(data, "assert.notOk(!fooTruthy, 'assert.notOk(!fooTruthy)');");
        assert.include(data, "assert.equal(5 * 2, 2 * 5, 'assert.equal(5*2, 2*5)');");

        done();
      });
    });
  });
});
