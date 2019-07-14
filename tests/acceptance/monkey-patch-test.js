import { computed } from 'ember-macro-helpers';
import { or } from '@ember/object/computed';
import { compute } from 'ember-macro-helpers/test-support';
import { module, test } from 'qunit';

module('Acceptance | monkey patch', function() {
  test('runs quick enough for built-in macros to work', function(assert) {
    compute({
      assert,
      computed: computed(or('key1', 'key2'), val => val),
      properties: {
        key1: false,
        key2: true
      },
      strictEqual: true
    });
  });
});
