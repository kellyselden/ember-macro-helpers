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

test('it collapses array.@each', function(assert) {
  assert.deepEqual(
    collapseKey('foo.@each.bar'),
    ['foo']
  );
});

test('it collapses array.@each with brace expansion', function(assert) {
  assert.deepEqual(
    collapseKey('foo.@each.{bar,baz}'),
    ['foo']
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
