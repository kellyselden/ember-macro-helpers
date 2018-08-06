import curriedComputed from 'ember-macro-helpers/curried-computed';
import { module, test } from 'qunit';
import { compute } from 'ember-macro-test-helpers';

let computed;

module('Integration | curried computed', function(hooks) {
  hooks.beforeEach(function() {
    computed = curriedComputed((val1, val2) => val1 + val2);
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
});
