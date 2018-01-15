import { testHelper } from 'shell/helpers/test-helper';
import { module, test } from 'qunit';

module('Unit | Helper | test helper');

test('it works', async function(assert) {
  assert.ok(await Promise.resolve(2), 'assert.ok(await Promise.resolve(2)) at example-test.js:7:2');
  assert.ok(() => true, 'assert.ok(() => true) at example-test.js:8:2');
  assert.notOk(1===1, "assert.notOk(1===1, 'one should not be equal to one') at example-test.js:9:2");
     assert.equal(1, 2, "assert.equal(1, 2, '1 should be equal to two') at example-test.js:10:5");
});
