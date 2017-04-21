import normalizeArrayKey from 'ember-macro-helpers/normalize-array-key';
import { module, test } from 'qunit';

module('Unit | normalize array key');

test('it wraps array if string', function(assert) {
  let result = normalizeArrayKey('foo.bar');

  assert.strictEqual(result, 'foo.bar.[]');
});

test('it wraps array if string and empty keys', function(assert) {
  let result = normalizeArrayKey('foo.bar', []);

  assert.strictEqual(result, 'foo.bar.[]');
});

test('it ignores undefined keys', function(assert) {
  let result = normalizeArrayKey('foo.bar', [undefined]);

  assert.strictEqual(result, 'foo.bar.[]');
});

test('it does nothing for non-string', function(assert) {
  let obj = {};

  let result = normalizeArrayKey(obj);

  assert.strictEqual(result, obj);
});

test('it does nothing for non-string and empty keys', function(assert) {
  let obj = {};

  let result = normalizeArrayKey(obj, []);

  assert.strictEqual(result, obj);
});

test('it does nothing for non-string and keys', function(assert) {
  let obj = {};

  let result = normalizeArrayKey(obj, ['prop']);

  assert.strictEqual(result, obj);
});

test('it does not alter array.[]', function(assert) {
  let result = normalizeArrayKey('foo.bar.[]');

  assert.strictEqual(result, 'foo.bar.[]');
});

test('it does not alter array.[] with empty keys', function(assert) {
  let result = normalizeArrayKey('foo.bar.[]', []);

  assert.strictEqual(result, 'foo.bar.[]');
});

test('it does not alter array.@each.prop', function(assert) {
  let result = normalizeArrayKey('foo.bar.@each.prop');

  assert.strictEqual(result, 'foo.bar.@each.prop');
});

test('it does not alter array.@each.prop with empty keys', function(assert) {
  let result = normalizeArrayKey('foo.bar.@each.prop', []);

  assert.strictEqual(result, 'foo.bar.@each.prop');
});

test('it watches array prop when raw array', function(assert) {
  let result = normalizeArrayKey('foo.bar', ['prop']);

  assert.strictEqual(result, 'foo.bar.@each.prop');
});

test('it watches array prop when already watching array length', function(assert) {
  let result = normalizeArrayKey('foo.bar.[]', ['prop']);

  assert.strictEqual(result, 'foo.bar.@each.prop');
});

test('it watches multiple array props when already watching array length', function(assert) {
  let result = normalizeArrayKey('foo.bar.[]', ['prop', 'prop2']);

  assert.strictEqual(result, 'foo.bar.@each.{prop,prop2}');
});

test('it watches array prop when already watching array prop', function(assert) {
  let result = normalizeArrayKey('foo.bar.@each.baz', ['prop']);

  assert.strictEqual(result, 'foo.bar.@each.{baz,prop}');
});

test('it watches multiple array props when already watching multiple array props', function(assert) {
  let result = normalizeArrayKey('foo.bar.@each.{baz,baz2}', ['prop', 'prop2']);

  assert.strictEqual(result, 'foo.bar.@each.{baz,baz2,prop,prop2}');
});
