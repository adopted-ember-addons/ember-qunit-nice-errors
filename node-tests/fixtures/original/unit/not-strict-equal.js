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

  assert.notStrictEqual(result, true);
  assert.notStrictEqual(
    (function () {
      return true;
    })(),
    (function () {
      return true;
    })()
  );
  assert.notStrictEqual(1, 1, 'testing equality');
  assert.notStrictEqual(true, true);
  assert.notStrictEqual(1 + 2 + 3 - 3 * 5 * 6, -84);
  assert.notStrictEqual(
    (function () {
      return true;
    })(),
    (function () {
      return true;
    })(),
    'testing a function'
  );
  assert.notStrictEqual(obj.a, obj.b);
  assert.notStrictEqual(testFunction(true), testFunction(true));
});

test('it works - variable', function (a) {
  a.notStrictEqual(result, result);
});
