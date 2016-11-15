import expandPropertyList from 'ember-macro-helpers/utils/expand-property-list';
import { module, test } from 'qunit';

module('Unit | Utility | expand property list');

test('it passes through a key', function(assert) {
  let result = expandPropertyList(['key']);

  assert.deepEqual(result, ['key']);
});

test('it retains any dots', function(assert) {
  let result = expandPropertyList(['key1.key2']);

  assert.deepEqual(result, ['key1.key2']);
});

test('it strips array []', function(assert) {
  let result = expandPropertyList(['key1.key2.[]']);

  assert.deepEqual(result, ['key1.key2']);
});

test('it strips array @each', function(assert) {
  let result = expandPropertyList(['key1.@each.key2']);

  assert.deepEqual(result, ['key1']);
});

test('it doesn\'t expand if there\'s an @each', function(assert) {
  let result = expandPropertyList(['key1.@each.{key2,key3}']);

  assert.deepEqual(result, ['key1']);
});

test('it expands properties', function(assert) {
  let result = expandPropertyList(['key1.{key2,key3}']);

  assert.deepEqual(result, ['key1.key2', 'key1.key3']);
});
