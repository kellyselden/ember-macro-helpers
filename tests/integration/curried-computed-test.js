import curriedComputed from 'ember-macro-helpers/curried-computed';
import { module, test } from 'qunit';
import compute from 'ember-macro-test-helpers/compute';

let computed;

module('Integration | curried computed', {
  beforeEach() {
    computed = curriedComputed((val1, val2) => val1 + val2);
  }
});

test('it curries the computed function', function(assert) {
  compute({
    assert,
    computed: computed('key1', 'key2'),
    properties: {
      key1: 1,
      key2: 2
    },
    strictEqual: 3
  });
});

test('it creates a read-only computed', function(assert) {
  compute({
    assert,
    computed: computed(),
    assertReadOnly: true
  });
});
