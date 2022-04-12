import { testHelper } from 'shell/helpers/test-helper';
import { module, test } from 'qunit';

function testFunction(a) {
  return a;
}

module('Unit | Helper | test helper');

test('it works', function (assert) {
  let result = testHelper([42]),
    obj = { a: true, b: false };

  assert.notOk(result, 'assert.notOk(result)');
  assert.notOk(
    (function () {
      return true;
    })(),
    'assert.notOk((function() { return true; })())'
  );
  assert.notOk(1 === 1, 'testing equality');
  assert.notOk(true, 'assert.notOk(true)');
  assert.notOk(1 + 2 + 3 - 3 * 5 * 6, 'assert.notOk((1+2+3)-3*5*6)');
  assert.notOk(
    (function () {
      return true;
    })(),
    'testing a function'
  );
  assert.notOk(obj.a, 'assert.notOk(obj.a)');
  assert.notOk(testFunction(true), 'assert.notOk(testFunction(true))');
  assert.notOk(
    (function () {
      return true;
    })(),
    'assert.notOk((function() {\n  return true;\n})())'
  );
});

test('it works - variable', function (a) {
  a.notOk(result, 'a.notOk(result)');
});
