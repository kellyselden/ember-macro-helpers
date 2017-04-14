import collapseKeys from 'ember-macro-helpers/collapse-keys';
import { module, test } from 'qunit';

module('Unit | collapse keys');

test('it allows empty arrays', function(assert) {
  assert.deepEqual(
    collapseKeys([]),
    []
  );
});

test('it ignores non-strings', function(assert) {
  assert.deepEqual(
    collapseKeys([{}]),
    [{}]
  );
});

test('it ignores string without brace expansion', function(assert) {
  assert.deepEqual(
    collapseKeys(['foo', 'one']),
    ['foo', 'one']
  );
});

test('it collapses brace expansion', function(assert) {
  assert.deepEqual(
    collapseKeys(['foo.{bar,baz}', 'one.{two,three}']),
    ['foo.bar', 'foo.baz', 'one.two', 'one.three']
  );
});
