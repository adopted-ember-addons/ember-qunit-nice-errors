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

  assert.notEqual(result, true, 'assert.notEqual(result, true)');
  assert.notEqual((function() { return true; })(), (function() { return true; })(), 'assert.notEqual((function() { return true; })(), (function() { return true; })())');
  assert.notEqual(1, 1, 'testing equality');
  assert.notEqual(true, true, 'assert.notEqual(true, true)');
  assert.notEqual((1+2+3)-3*5*6, -84, 'assert.notEqual((1+2+3)-3*5*6, -84)');
  assert.notEqual(function() { return true; }(), function(){ return true; }(), 'testing a function');
  assert.notEqual(obj.a, obj.b, 'assert.notEqual(obj.a, obj.b)');
  assert.notEqual(testFunction(true), testFunction(true), 'assert.notEqual(testFunction(true), testFunction(true))');
});

test('it works - variable', function(a) {
  a.notEqual(result, result, 'a.notEqual(result, result)');
});
