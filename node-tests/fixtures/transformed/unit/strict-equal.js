import { testHelper } from 'shell/helpers/test-helper';
import { module, test } from 'qunit';

function testFunction(a) {
  return a;
}

module('Unit | Helper | test helper');

//Replace this with your real tests.
test('it works', function (assert) {
  let result = testHelper([42]),
    obj = { a: true, b: false };

  assert.strictEqual(result, true, 'assert.strictEqual(result, true)');
  assert.strictEqual(
    (function () {
      return true;
    })(),
    (function () {
      return true;
    })(),
    'assert.strictEqual((function() { return true; })(), (function() { return true; })())'
  );
  assert.strictEqual(1, 1, 'testing equality');
  assert.strictEqual(true, true, 'assert.strictEqual(true, true)');
  assert.strictEqual(
    1 + 2 + 3 - 3 * 5 * 6,
    -84,
    'assert.strictEqual((1+2+3)-3*5*6, -84)'
  );
  assert.strictEqual(
    (function () {
      return true;
    })(),
    (function () {
      return true;
    })(),
    'testing a function'
  );
  assert.strictEqual(obj.a, obj.b, 'assert.strictEqual(obj.a, obj.b)');
  assert.strictEqual(
    testFunction(true),
    testFunction(true),
    'assert.strictEqual(testFunction(true), testFunction(true))'
  );
});

test('it works - variable', function (a) {
  a.strictEqual(result, result, 'a.strictEqual(result, result)');
});
