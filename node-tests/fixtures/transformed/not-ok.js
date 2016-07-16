import { testHelper } from 'shell/helpers/test-helper';
import { module, test } from 'qunit';

function testFunction(a) {
  return a;
}

module('Unit | Helper | test helper');

test('it works', function(assert) {
  let result = testHelper([42]),
      obj = { a: true, b: false };

  assert.notOk(result, 'assert.notOk(result) not-ok.js:14:2');
  assert.notOk((function() { return true; })(), 'assert.notOk((function() { return true; })()) not-ok.js:15:2');
  assert.notOk(1===1, 'testing equality');
  assert.notOk(true, 'assert.notOk(true) not-ok.js:17:2');
  assert.notOk((1+2+3)-3*5*6, 'assert.notOk((1+2+3)-3*5*6) not-ok.js:18:2');
  assert.notOk(function() { return true; }(), 'testing a function');
  assert.notOk(obj.a, 'assert.notOk(obj.a) not-ok.js:20:2');
  assert.notOk(testFunction(true), 'assert.notOk(testFunction(true)) not-ok.js:21:2');
  assert.notOk((function() {
    return true;
  })(), 'assert.notOk((function() {\n  return true;\n})()) not-ok.js:22:2');
});

test('it works - variable', function(a) {
   a.notOk(result, 'a.notOk(result) not-ok.js:28:3');
});
