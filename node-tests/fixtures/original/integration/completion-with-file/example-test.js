import { testHelper } from 'shell/helpers/test-helper';
import { module, test } from 'qunit';

module('Unit | Helper | test helper');

test('it works', async function(assert) {
  assert.ok(await Promise.resolve(2));
  assert.ok(() => true);
  assert.notOk(1===1, 'one should not be equal to one');
     assert.equal(1, 2, '1 should be equal to two');
});
