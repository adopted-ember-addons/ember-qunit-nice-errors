import { testHelper } from 'shell/helpers/test-helper';
import { module, test } from 'qunit';

function testFunction(a) {
  return a;
}

module('Unit | Helper | test foo helper');

//Replace this with your real tests.
test('it works', async function (assert) {
  let obj = { a: true, b: false };

  assert.ok(await Promise.resolve(2), 'assert.ok(await Promise.resolve(2))');
  assert.ok(() => {
    return true;
  }, 'assert.ok(() => { return true })');
  assert.ok(class Person {}, 'assert.ok(class Person {})');
  assert.ok(
    (function () {
      return true;
    })(),
    'assert.ok((function() { return true; })())'
  );
  assert.ok(1 === 1, 'testing equality');
  assert.ok(true, 'assert.ok(true)');
  assert.ok(1 + 2 + 3 - 3 * 5 * 6, 'assert.ok((1+2+3)-3*5*6)');
  assert.ok(
    (function () {
      return true;
    })(),
    'testing a function'
  );
  assert.ok(obj.a, 'assert.ok(obj.a)');
  assert.ok(testFunction(true), 'assert.ok(testFunction(true))');
  assert.ok(
    (function () {
      return true;
    })(),
    'assert.ok((function() {\n  return true;\n})())'
  );
});

test('it works - variable', function (a) {
  let result = testHelper([42]);
  a.ok(result, 'a.ok(result)');
});
