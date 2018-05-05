import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

let store;

module('Unit | Controller | dummy', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    store = this.owner.lookup('service:store');
  });

  test('it doesn\'t have detroyed errors when working with controllers + async model relationships', function(assert) {
    let model = run(() => {
      return store.createRecord('parent', {
        children: [
          store.createRecord('child', { name: 'foo' }),
          store.createRecord('child', { name: 'bar' })
        ]
      });
    });
    let controller = this.owner.factoryFor('controller:dummy').create({ model });

    let result = controller.get('childNames');

    assert.deepEqual(result, ['foo', 'bar']);
  });
});
