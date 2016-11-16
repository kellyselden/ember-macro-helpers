import { expandProperty } from 'ember-macro-helpers/utils';
import { module, test } from 'qunit';

module('Unit | Utility | expand property');

test('it passes through a key', function(assert) {
  let result = expandProperty('key');

  assert.deepEqual(result, ['key']);
});

test('it retains any dots', function(assert) {
  let result = expandProperty('key1.key2');

  assert.deepEqual(result, ['key1.key2']);
});

test('it strips array []', function(assert) {
  let result = expandProperty('key1.key2.[]');

  assert.deepEqual(result, ['key1.key2']);
});

test('it strips array @each', function(assert) {
  let result = expandProperty('key1.@each.key2');

  assert.deepEqual(result, ['key1']);
});

test('it doesn\'t expand if there\'s an @each', function(assert) {
  let result = expandProperty('key1.@each.{key2,key3}');

  assert.deepEqual(result, ['key1']);
});

test('it expands properties', function(assert) {
  let result = expandProperty('key1.{key2,key3}');

  assert.deepEqual(result, ['key1.key2', 'key1.key3']);
});
