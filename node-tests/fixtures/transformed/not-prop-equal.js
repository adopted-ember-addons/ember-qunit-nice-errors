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

  assert.notPropEqual(result, true, 'not prop equal: result !== true');
  assert.notPropEqual((function() { return true; })(), (function() { return true; })(),'not prop equal: (function() { return true; })() !== (function() { return true; })()');
  assert.notPropEqual(1, 1, 'testing equality');
  assert.notPropEqual(true, true, 'not prop equal: true !== true');
  assert.notPropEqual((1+2+3)-3*5*6, -84, 'not prop equal: (1+2+3)-3*5*6 !== -84');
  assert.notPropEqual(function() { return true; }(), function(){ return true; }(), 'testing a function');
  assert.notPropEqual(obj.a, obj.b, 'not prop equal: obj.a !== obj.b');
  assert.notPropEqual(testFunction(true), testFunction(true), 'not prop equal: testFunction(true) !== testFunction(true)');
});

test('it works - variable', function(a) {
  a.notPropEqual(result, result, 'not prop equal: result !== result');
});



