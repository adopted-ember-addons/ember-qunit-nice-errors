import { testHelper } from 'shell/helpers/test-helper';
import { module, test } from 'qunit';

function testFunction(a) {
  return a;
}

module('Unit | Helper | test helper');

test('it works', function(assert) {
  let result = testHelper([42]),
      obj = { a: true, b: false };

  assert.notOk(result, 'not ok: result');
  assert.notOk((function() { return true; })(), 'not ok: (function() { return true; })()');
  assert.notOk(1===1, 'testing equality');
  assert.notOk(true, 'not ok: true');
  assert.notOk((1+2+3)-3*5*6, 'not ok: (1+2+3)-3*5*6');
  assert.notOk(function() { return true; }(), 'testing a function');
  assert.notOk(obj.a, 'not ok: obj.a');
  assert.notOk(testFunction(true), 'not ok: testFunction(true)');
});

test('it works - variable', function(a) {
  a.notOk(result, 'not ok: result');
});
