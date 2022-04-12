import { testHelper } from 'shell/helpers/test-helper';
import { module, test } from 'qunit';

module('Unit | Helper | test helper');

test('it works', async function (assert) {
  assert.ok(result, 'assert.ok(result) at example-test.js:7:2');
  assert.ok(
    await Promise.resolve(2),
    'assert.ok(await Promise.resolve(2)) at example-test.js:8:2'
  );
  assert.ok(
    class Person {},
    'assert.ok(class Person {}) at example-test.js:9:2'
  );
  assert.notOk(1 === 1, 'assert.notOk(1===1) at example-test.js:10:2');
  assert.equal(1, 2, 'assert.equal(1, 2) at example-test.js:11:5');
});
