import { click, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | application', function(hooks) {
  setupApplicationTest(hooks);

  test('double render failing test', async function(assert) {
    await visit('/double-render');

    assert.dom('.computed').hasText('test val 1');

    await click('button');

    assert.dom('.computed').hasText('test val 2');

    await click('button');

    assert.dom('.computed').hasText('test val 3');
  });

  test('no rerender failing test', async function(assert) {
    await visit('/no-rerender');

    assert.dom('.items').hasText('1');

    await click('button');

    assert.dom('.items').hasText('0');

    await click('button');

    assert.dom('.items').hasText('1');
  });
});
