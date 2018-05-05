import collapseKeys, { collapseKeysWithMap } from 'ember-macro-helpers/collapse-keys';
import { module, test } from 'qunit';

module('Unit | collapse keys', function() {
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

  test('it collapses array.[]', function(assert) {
    assert.deepEqual(
      collapseKeys(['foo.[]']),
      ['foo']
    );
  });

  test('it collapses array.@each', function(assert) {
    assert.deepEqual(
      collapseKeys(['foo.@each.bar']),
      ['foo']
    );
  });

  test('it collapses array.@each with brace expansion', function(assert) {
    assert.deepEqual(
      collapseKeys(['foo.@each.{bar,baz}']),
      ['foo']
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

  test('keyMap: it allows empty arrays', function(assert) {
    assert.deepEqual(
      collapseKeysWithMap([]).keyMap,
      []
    );
  });

  test('keyMap: it ignores non-strings', function(assert) {
    assert.deepEqual(
      collapseKeysWithMap([{}]).keyMap,
      [0]
    );
  });

  test('keyMap: it ignores array.[]', function(assert) {
    assert.deepEqual(
      collapseKeysWithMap(['foo.[]']).keyMap,
      [0]
    );
  });

  test('keyMap: it ignores array.@each', function(assert) {
    assert.deepEqual(
      collapseKeysWithMap(['foo.@each.bar']).keyMap,
      [0]
    );
  });

  test('keyMap: it ignores array.@each with brace expansion', function(assert) {
    assert.deepEqual(
      collapseKeysWithMap(['foo.@each.{bar,baz}']).keyMap,
      [0]
    );
  });

  test('keyMap: it ignores string without brace expansion', function(assert) {
    assert.deepEqual(
      collapseKeysWithMap(['foo', 'one']).keyMap,
      [0, 1]
    );
  });

  test('keyMap: it collapses brace expansion', function(assert) {
    assert.deepEqual(
      collapseKeysWithMap(['foo.{bar,baz}', 'one.{two,three}']).keyMap,
      [0, 0, 1, 1]
    );
  });
});
