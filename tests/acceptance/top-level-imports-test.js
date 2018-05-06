import { module, test } from 'qunit';
import expect from '../helpers/expect-imports';
import helpers, {
  computed,
  createClassComputed,
  curriedComputed,
  lazyComputed,
  lazyCurriedComputed,
  literal,
  raw,
  reads,
  writable
} from 'ember-macro-helpers';
import _computed from 'ember-macro-helpers/computed';
import _createClassComputed from 'ember-macro-helpers/create-class-computed';
import _curriedComputed from 'ember-macro-helpers/curried-computed';
import _lazyComputed from 'ember-macro-helpers/lazy-computed';
import _lazyCurriedComputed from 'ember-macro-helpers/lazy-curried-computed';
import _literal from 'ember-macro-helpers/literal';
import _raw from 'ember-macro-helpers/raw';
import _reads from 'ember-macro-helpers/reads';
import _writable from 'ember-macro-helpers/writable';

module('Acceptance | top level imports', function() {
  test('all top level global imports', function(assert) {
    expect(assert, helpers);

    assert.ok(helpers.computed);
    assert.ok(helpers.createClassComputed);
    assert.ok(helpers.curriedComputed);
    assert.ok(helpers.lazyComputed);
    assert.ok(helpers.lazyCurriedComputed);
    assert.ok(helpers.literal);
    assert.ok(helpers.raw);
    assert.ok(helpers.reads);
    assert.ok(helpers.writable);
  });

  test('all top level imports', function(assert) {
    expect(assert, helpers);

    assert.ok(computed);
    assert.ok(createClassComputed);
    assert.ok(curriedComputed);
    assert.ok(lazyComputed);
    assert.ok(lazyCurriedComputed);
    assert.ok(literal);
    assert.ok(raw);
    assert.ok(reads);
    assert.ok(writable);
  });

  test('all top level default imports', function(assert) {
    assert.ok(_computed);
    assert.ok(_createClassComputed);
    assert.ok(_curriedComputed);
    assert.ok(_lazyComputed);
    assert.ok(_lazyCurriedComputed);
    assert.ok(_literal);
    assert.ok(_raw);
    assert.ok(_reads);
    assert.ok(_writable);
  });
});
