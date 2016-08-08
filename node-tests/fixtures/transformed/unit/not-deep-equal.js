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

  assert.notDeepEqual(result, true, 'assert.notDeepEqual(result, true)');
  assert.notDeepEqual((function() { return true; })(), (function() { return true; })(),'assert.notDeepEqual((function() { return true; })(), (function() { return true; })())');
  assert.notDeepEqual(1, 1, 'testing equality');
  assert.notDeepEqual(true, true, 'assert.notDeepEqual(true, true)');
  assert.notDeepEqual((1+2+3)-3*5*6, -84, 'assert.notDeepEqual((1+2+3)-3*5*6, -84)');
  assert.notDeepEqual(function() { return true; }(), function(){ return true; }(), 'testing a function');
  assert.notDeepEqual(obj.a, obj.b, 'assert.notDeepEqual(obj.a, obj.b)');
  assert.notDeepEqual(testFunction(true), testFunction(true), 'assert.notDeepEqual(testFunction(true), testFunction(true))');
});

test('it works - variable', function(a) {
  a.notDeepEqual(result, result, 'a.notDeepEqual(result, result)');
});


