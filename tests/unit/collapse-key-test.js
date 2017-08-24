import collapseKey from 'ember-macro-helpers/collapse-key';
import { module, test } from 'qunit';

module('Unit | collapse key');

test('it ignores non-strings', function(assert) {
  assert.deepEqual(
    collapseKey({}),
    [{}]
  );
});

test('it collapses array.[]', function(assert) {
  assert.deepEqual(
    collapseKey('foo.[]'),
    ['foo']
  );
});

test('it collapses []', function(assert) {
  assert.deepEqual(
    collapseKey('[]'),
    ['']
  );
});

test('it collapses array.@each', function(assert) {
  assert.deepEqual(
    collapseKey('foo.@each.bar'),
    ['foo']
  );
});

test('it collapses @each', function(assert) {
  assert.deepEqual(
    collapseKey('@each.bar'),
    ['']
  );
});

test('it collapses array.@each with brace expansion', function(assert) {
  assert.deepEqual(
    collapseKey('foo.@each.{bar,baz}'),
    ['foo']
  );
});

test('it collapses @each with brace expansion', function(assert) {
  assert.deepEqual(
    collapseKey('@each.{bar,baz}'),
    ['']
  );
});

test('it ignores string without brace expansion', function(assert) {
  assert.deepEqual(
    collapseKey('foo'),
    ['foo']
  );
});

test('it collapses brace expansion', function(assert) {
  assert.deepEqual(
    collapseKey('foo.{bar,baz}'),
    ['foo.bar', 'foo.baz']
  );
});

test('it collapses brace expansion with @each', function(assert) {
  assert.deepEqual(
    collapseKey('foo.{@each.bar,baz}'),
    ['foo', 'foo.baz']
  );
});

test('it collapses brace expansion with []', function(assert) {
  assert.deepEqual(
    collapseKey('foo.{bar.[],baz}'),
    ['foo.bar', 'foo.baz']
  );
});
