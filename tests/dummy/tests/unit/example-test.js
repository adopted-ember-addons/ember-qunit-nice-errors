import { module, test } from 'qunit';

module('Unit | example', function() {
  test('passes all assertions', function (assert) {
    var fooTruthy = true;

    assert.ok(fooTruthy);
    assert.ok(fooTruthy);
    assert.equal(5 * 2, 2 * 5);
  });
});
