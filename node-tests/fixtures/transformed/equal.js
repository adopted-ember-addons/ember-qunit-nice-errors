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

  assert.equal(result, true, 'equal: result true');
  assert.equal((function() { return true; })(), (function() { return true; })(),'equal: (function() { return true; })() (function() { return true; })()');
  assert.equal(1, 1, 'testing equality');
  assert.equal(true, true, 'equal: true true');
  assert.equal((1+2+3)-3*5*6, -84, 'equal: (1+2+3)-3*5*6 -84');
  assert.equal(function() { return true; }(), function(){ return true; }(), 'testing a function');
  assert.equal(obj.a, obj.b, 'equal: obj.a obj.b');
  assert.equal(testFunction(true), testFunction(true), 'equal: testFunction(true) testFunction(true)');
});

test('it works - variable', function(a) {
  a.equal(result, result, 'equal: result result');
});
