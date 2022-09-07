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

  assert.propEqual(result, true);
  assert.propEqual(
    (function () {
      return true;
    })(),
    (function () {
      return true;
    })()
  );
  assert.propEqual(1, 1, 'testing equality');
  assert.propEqual(true, true);
  assert.propEqual(1 + 2 + 3 - 3 * 5 * 6, -84);
  assert.propEqual(
    (function () {
      return true;
    })(),
    (function () {
      return true;
    })(),
    'testing a function'
  );
  assert.propEqual(obj.a, obj.b);
  assert.propEqual(testFunction(true), testFunction(true));
});

test('it works - variable', function (a) {
  let result = testHelper([42]);
  a.propEqual(result, result);
});
