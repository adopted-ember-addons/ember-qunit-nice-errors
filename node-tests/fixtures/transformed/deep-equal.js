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

  assert.deepEqual(result, true, 'deep equal: result === true');
  assert.deepEqual((function() { return true; })(), (function() { return true; })(),'deep equal: (function() { return true; })() === (function() { return true; })()');
  assert.deepEqual(1, 1, 'testing equality');
  assert.deepEqual(true, true, 'deep equal: true === true');
  assert.deepEqual((1+2+3)-3*5*6, -84, 'deep equal: (1+2+3)-3*5*6 === -84');
  assert.deepEqual(function() { return true; }(), function(){ return true; }(), 'testing a function');
  assert.deepEqual(obj.a, obj.b, 'deep equal: obj.a === obj.b');
  assert.deepEqual(testFunction(true), testFunction(true), 'deep equal: testFunction(true) === testFunction(true)');
});

test('it works - variable', function(a) {
  a.deepEqual(result, result, 'deep equal: result === result');
});

