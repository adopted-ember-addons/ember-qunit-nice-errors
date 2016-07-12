import { testHelper } from 'shell/helpers/test-helper';
import { module, test } from 'qunit';

function testFunction(a) {
  return a;
}

module('Unit | Helper | test helper');

//Replace this with your real tests.
test('it works', function(assert) {
  let result = testHelper([42]),
      obj = { a: true, b: false };

  assert.ok(result, 'ok: result');
  assert.ok((function() { return true; })(), 'ok: (function() { return true; })()');
  assert.ok(1===1, 'testing equality');
  assert.ok(true, 'ok: true');
  assert.ok((1+2+3)-3*5*6, 'ok: (1+2+3)-3*5*6');
  assert.ok(function() { return true; }(), 'testing a function');
  assert.ok(obj.a, 'ok: obj.a');
  assert.ok(testFunction(true), 'ok: testFunction(true)');
});

test('it works - variable', function(a) {
  a.ok(result, 'ok: result');
});
