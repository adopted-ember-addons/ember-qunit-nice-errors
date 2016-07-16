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

  assert.ok(result, 'assert.ok(result) ok.js:15:2');
  assert.ok((function() { return true; })(), 'assert.ok((function() { return true; })()) ok.js:16:2');
  assert.ok(1===1, 'testing equality');
  assert.ok(true, 'assert.ok(true) ok.js:18:2');
  assert.ok((1+2+3)-3*5*6, 'assert.ok((1+2+3)-3*5*6) ok.js:19:2');
  assert.ok(function() { return true; }(), 'testing a function');
  assert.ok(obj.a, 'assert.ok(obj.a) ok.js:21:2');
  assert.ok(testFunction(true), 'assert.ok(testFunction(true)) ok.js:22:2');
  assert.ok((function() {
    return true;
  })(), 'assert.ok((function() {\n  return true;\n})()) ok.js:23:2');
});

test('it works - variable', function(a) {
  a.ok(result, 'a.ok(result) ok.js:29:3');
});
