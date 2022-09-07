import { module, test } from 'qunit';

module('Unit | example', () => {
  test('passes all assertions', function (assert) {
    var fooTruthy = true;

    assert.ok(fooTruthy);
    assert.ok(fooTruthy);
    assert.deepEqual(5 * 2, 2 * 5);
  });
});
