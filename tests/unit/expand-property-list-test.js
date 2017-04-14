import expandPropertyList from 'ember-macro-helpers/expand-property-list';
import { module, test } from 'qunit';

module('Unit | expand property list');

test('it passes through a key', function(assert) {
  let result = expandPropertyList(['key']);

  assert.deepEqual(result, ['key']);
});

test('it retains any dots', function(assert) {
  let result = expandPropertyList(['key1.key2']);

  assert.deepEqual(result, ['key1.key2']);
});

test('it retains array []', function(assert) {
  let result = expandPropertyList(['key1.key2.[]']);

  assert.deepEqual(result, ['key1.key2.[]']);
});

test('it retains array @each', function(assert) {
  let result = expandPropertyList(['key1.@each.key2']);

  assert.deepEqual(result, ['key1.@each.key2']);
});

test('it expands properties', function(assert) {
  let result = expandPropertyList(['key1.{key2,key3}']);

  assert.deepEqual(result, ['key1.key2', 'key1.key3']);
});

test('it expands array properties', function(assert) {
  let result = expandPropertyList(['key1.@each.{key2,key3}']);

  assert.deepEqual(result, ['key1.@each.key2', 'key1.@each.key3']);
});
