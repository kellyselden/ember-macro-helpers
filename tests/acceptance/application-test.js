import { click, find, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | application', function(hooks) {
  setupApplicationTest(hooks);

  test('double render failing test', async function(assert) {
    await visit('/double-render');

    assert.equal(find('.computed').textContent, 'test val 1');

    await click('button');

    assert.equal(find('.computed').textContent, 'test val 2');

    await click('button');

    assert.equal(find('.computed').textContent, 'test val 3');
  });

  test('no rerender failing test', async function(assert) {
    await visit('/no-rerender');

    assert.equal(find('.items').textContent, 1);

    await click('button');

    assert.equal(find('.items').textContent, 0);

    await click('button');

    assert.equal(find('.items').textContent, 1);
  });
});
