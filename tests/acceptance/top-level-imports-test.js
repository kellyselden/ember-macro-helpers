import { module, test } from 'qunit';
import expect from '../helpers/expect-imports';
import helpers, {
  collapseKey,
  collapseKeys,
  computedUnsafe,
  computed,
  createClassComputed,
  curriedComputed,
  expandPropertyList,
  expandProperty,
  flattenKeysUnsafe,
  flattenKeys,
  getValueUnsafe,
  getValue,
  isComputed,
  lazyComputed,
  lazyCurriedComputed,
  literal,
  normalizeArrayKey,
  raw,
  reads,
  writable
} from 'ember-macro-helpers';
import _collapseKey from 'ember-macro-helpers/collapse-key';
import _collapseKeys from 'ember-macro-helpers/collapse-keys';
import _computedUnsafe from 'ember-macro-helpers/computed-unsafe';
import _computed from 'ember-macro-helpers/computed';
import _createClassComputed from 'ember-macro-helpers/create-class-computed';
import _curriedComputed from 'ember-macro-helpers/curried-computed';
import _expandPropertyList from 'ember-macro-helpers/expand-property-list';
import _expandProperty from 'ember-macro-helpers/expand-property';
import _flattenKeysUnsafe from 'ember-macro-helpers/flatten-keys-unsafe';
import _flattenKeys from 'ember-macro-helpers/flatten-keys';
import _getValueUnsafe from 'ember-macro-helpers/get-value-unsafe';
import _getValue from 'ember-macro-helpers/get-value';
import _isComputed from 'ember-macro-helpers/is-computed';
import _lazyComputed from 'ember-macro-helpers/lazy-computed';
import _lazyCurriedComputed from 'ember-macro-helpers/lazy-curried-computed';
import _literal from 'ember-macro-helpers/literal';
import _normalizeArrayKey from 'ember-macro-helpers/normalize-array-key';
import _raw from 'ember-macro-helpers/raw';
import _reads from 'ember-macro-helpers/reads';
import _writable from 'ember-macro-helpers/writable';

module('Acceptance | top level imports', function() {
  test('all top level global imports', function(assert) {
    expect(assert, helpers);

    assert.ok(helpers.collapseKey);
    assert.ok(helpers.collapseKeys);
    assert.ok(helpers.computedUnsafe);
    assert.ok(helpers.computed);
    assert.ok(helpers.createClassComputed);
    assert.ok(helpers.curriedComputed);
    assert.ok(helpers.expandPropertyList);
    assert.ok(helpers.expandProperty);
    assert.ok(helpers.flattenKeysUnsafe);
    assert.ok(helpers.flattenKeys);
    assert.ok(helpers.getValueUnsafe);
    assert.ok(helpers.getValue);
    assert.ok(helpers.isComputed);
    assert.ok(helpers.lazyComputed);
    assert.ok(helpers.lazyCurriedComputed);
    assert.ok(helpers.literal);
    assert.ok(helpers.normalizeArrayKey);
    assert.ok(helpers.raw);
    assert.ok(helpers.reads);
    assert.ok(helpers.writable);
  });

  test('all top level imports', function(assert) {
    expect(assert, helpers);

    assert.ok(collapseKey);
    assert.ok(collapseKeys);
    assert.ok(computedUnsafe);
    assert.ok(computed);
    assert.ok(createClassComputed);
    assert.ok(curriedComputed);
    assert.ok(expandPropertyList);
    assert.ok(expandProperty);
    assert.ok(flattenKeysUnsafe);
    assert.ok(flattenKeys);
    assert.ok(getValueUnsafe);
    assert.ok(getValue);
    assert.ok(isComputed);
    assert.ok(lazyComputed);
    assert.ok(lazyCurriedComputed);
    assert.ok(literal);
    assert.ok(normalizeArrayKey);
    assert.ok(raw);
    assert.ok(reads);
    assert.ok(writable);
  });

  test('all top level default imports', function(assert) {
    assert.ok(_collapseKey);
    assert.ok(_collapseKeys);
    assert.ok(_computedUnsafe);
    assert.ok(_computed);
    assert.ok(_createClassComputed);
    assert.ok(_curriedComputed);
    assert.ok(_expandPropertyList);
    assert.ok(_expandProperty);
    assert.ok(_flattenKeysUnsafe);
    assert.ok(_flattenKeys);
    assert.ok(_getValueUnsafe);
    assert.ok(_getValue);
    assert.ok(_isComputed);
    assert.ok(_lazyComputed);
    assert.ok(_lazyCurriedComputed);
    assert.ok(_literal);
    assert.ok(_normalizeArrayKey);
    assert.ok(_raw);
    assert.ok(_reads);
    assert.ok(_writable);
  });
});
