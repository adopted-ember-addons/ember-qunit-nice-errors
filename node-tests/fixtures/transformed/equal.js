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

  assert.equal(result, true, 'assert.equal(result, true) at equal.js:15:2');
  assert.equal((function() { return true; })(), (function() { return true; })(), 'assert.equal((function() { return true; })(), (function() { return true; })()) at equal.js:16:2');
  assert.equal(1, 1, 'testing equality');
  assert.equal(true, true, 'assert.equal(true, true) at equal.js:18:2');
  assert.equal((1+2+3)-3*5*6, -84, 'assert.equal((1+2+3)-3*5*6, -84) at equal.js:19:2');
  assert.equal(function() { return true; }(), function(){ return true; }(), 'testing a function');
  assert.equal(obj.a, obj.b, 'assert.equal(obj.a, obj.b) at equal.js:21:2');
  assert.equal(testFunction(true), testFunction(true), 'assert.equal(testFunction(true), testFunction(true)) at equal.js:22:2');
});

test('it works - variable', function(a) {
   a.equal(result, result, 'a.equal(result, result) at equal.js:26:3');
});
