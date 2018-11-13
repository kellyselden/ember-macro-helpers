import lazyCurriedComputed from 'ember-macro-helpers/lazy-curried-computed';
import { module, test } from 'qunit';
import { compute } from 'ember-macro-helpers/test-support';

let computed;

module('Integration | lazy curried computed', function(hooks) {
  hooks.beforeEach(function() {
    computed = lazyCurriedComputed({
      get(get, key1, key2) {
        return get(key1) || get(key2);
      }
    });
  });

  test('it works', function(assert) {
    compute({
      assert,
      computed: computed('key1', 'key2'),
      properties: {
        key1: null,
        key2: 2
      },
      strictEqual: 2
    });
  });

  test('it sets', function(assert) {
    let { subject } = compute({
      computed: computed('key1', 'key2'),
      properties: {
        key1: null,
        key2: 2
      }
    });

    subject.set('computed', 3);

    assert.equal(subject.get('computed'), 3);
  });
});
