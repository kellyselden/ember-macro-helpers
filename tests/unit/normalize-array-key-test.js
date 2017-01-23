import normalizeArrayKey from 'ember-macro-helpers/normalize-array-key';
import { module, test } from 'qunit';

module('Unit | normalize array key');

test('it wraps array if string', function(assert) {
  let result = normalizeArrayKey('array');

  assert.strictEqual(result, 'array.[]');
});

test('it does nothing for non-string', function(assert) {
  let obj = {};

  let result = normalizeArrayKey(obj);

  assert.strictEqual(result, obj);
});
