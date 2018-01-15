import { testHelper } from 'shell/helpers/test-helper';
import { module, test } from 'qunit';

module('Unit | Helper | test helper');

test('it works', async function(assert) {
  assert.expect(3);

  assert.ok(await Promise.resolve(2), 'assert.ok(await Promise.resolve(2))');
  assert.ok(() => { return true }, 'assert.ok(() => { return true })');
  assert.ok(class Person {}, 'assert.ok(class Person {})');
  assert.notOk(1===1, "assert.notOk(1===1, '1 should not be equal to 1')");
  assert.equal(1, 2, "assert.equal(1, 2, '1 should be equal 2')");
});
