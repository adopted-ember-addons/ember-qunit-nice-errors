import { test } from 'qunit';
import moduleForAcceptance from '../helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | index');

test('scott visiting /index', async assert {
  await visit('/');
  assert.equal(currentURL(), '/');
});
