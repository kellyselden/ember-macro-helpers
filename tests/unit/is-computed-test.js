import computed from 'ember-computed';
import isComputed from 'ember-macro-helpers/is-computed';
import { module, test } from 'qunit';

module('Unit | Utility | is computed');

test('it returns true for computed', function(assert) {
  let result = isComputed(computed(() => {}));

  assert.strictEqual(result, true);
});

test('it returns false for object', function(assert) {
  let result = isComputed({});

  assert.strictEqual(result, false);
});

test('it returns false for string', function(assert) {
  let result = isComputed('');

  assert.strictEqual(result, false);
});

test('it returns false for number', function(assert) {
  let result = isComputed(0);

  assert.strictEqual(result, false);
});

test('it returns false for boolean', function(assert) {
  let result = isComputed(false);

  assert.strictEqual(result, false);
});
