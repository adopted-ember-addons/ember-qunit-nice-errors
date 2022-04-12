import { testHelper } from 'shell/helpers/test-helper';
import { module, test } from 'qunit';

module('Unit | Helper | test helper');

test('it works', async function (assert) {
  assert.ok(result);
  assert.ok(await Promise.resolve(2));
  assert.ok(class Person {});
  assert.notOk(1 === 1);
  assert.equal(1, 2);
});
