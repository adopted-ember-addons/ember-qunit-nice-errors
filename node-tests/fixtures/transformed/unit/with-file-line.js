import { module, test } from 'qunit';

module('Unit | Helper | test helper');

//Replace this with your real tests.
test('it works', function (assert) {
  var result = false;

  assert.ok(result, 'assert.ok(result) at with-file-line.js:10:2');
  assert.equal(1, 3, 'assert.equal(1, 3) at with-file-line.js:11:2');

  assert.notOk(1 === 1, 'assert.notOk(1===1) at with-file-line.js:13:5');
});
