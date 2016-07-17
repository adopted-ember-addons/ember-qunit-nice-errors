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

  assert.notEqual(result, true, 'assert.notEqual(result, true) at not-equal.js:15:2');
  assert.notEqual((function() { return true; })(), (function() { return true; })(), 'assert.notEqual((function() { return true; })(), (function() { return true; })()) at not-equal.js:16:2');
  assert.notEqual(1, 1, 'testing equality');
  assert.notEqual(true, true, 'assert.notEqual(true, true) at not-equal.js:18:2');
  assert.notEqual((1+2+3)-3*5*6, -84, 'assert.notEqual((1+2+3)-3*5*6, -84) at not-equal.js:19:2');
  assert.notEqual(function() { return true; }(), function(){ return true; }(), 'testing a function');
  assert.notEqual(obj.a, obj.b, 'assert.notEqual(obj.a, obj.b) at not-equal.js:21:2');
  assert.notEqual(testFunction(true), testFunction(true), 'assert.notEqual(testFunction(true), testFunction(true)) at not-equal.js:22:2');
});

test('it works - variable', function(a) {
   a.notEqual(result, result, 'a.notEqual(result, result) at not-equal.js:26:3');
});
