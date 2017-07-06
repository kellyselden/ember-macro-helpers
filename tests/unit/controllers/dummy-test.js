import { run } from '@ember/runloop';
import { moduleFor, test } from 'ember-qunit';

let store;

moduleFor('controller:dummy', 'Unit | Controller | dummy', {
  needs: ['model:parent', 'model:child'],

  beforeEach() {
    store = this.container.lookup('service:store');
  }
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
  let controller = this.subject({ model });

  let result = controller.get('childNames');

  assert.deepEqual(result, ['foo', 'bar']);
});
