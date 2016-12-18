import literal from 'ember-macro-helpers/literal';
import { module, test } from 'qunit';
import compute from 'ember-macro-test-helpers/compute';

module('Integration | Macro | literal');

test('it returns value verbatim', function(assert) {
  compute({
    assert,
    computed: literal('source'),
    strictEqual: 'source'
  });
});

test('it doesn\'t treat it as a key, but as a string literal', function(assert) {
  compute({
    assert,
    computed: literal('source'),
    properties: {
      source: 'new source'
    },
    strictEqual: 'source'
  });
});

test('it is readOnly', function(assert) {
  compute({
    assert,
    computed: literal('source'),
    assertReadOnly: true
  });
});
