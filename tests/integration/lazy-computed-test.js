import lazyComputed from 'ember-macro-helpers/lazy-computed';
import computed from 'ember-macro-helpers/computed';
import getValue from 'ember-macro-helpers/get-value';
import { module, test } from 'qunit';
import sinon from 'sinon';
import { compute } from 'ember-macro-helpers/test-support';

const getReturnValue = 'get return value test';
const setReturnValue = 'set return value test';
const newValue = 'new value test';

let getCallback;
let setCallback;

module('Integration | lazy computed', function(hooks) {
  hooks.beforeEach(function() {
    getCallback = sinon.stub().returns(getReturnValue);
    setCallback = sinon.stub().returns(setReturnValue);
  });

  function alias(key) {
    return computed(key, val => val);
  }

  test('works with no key', function(assert) {
    compute({
      assert,
      computed: lazyComputed(getCallback),
      strictEqual: getReturnValue
    });
  });

  test('works with undefined key', function(assert) {
    compute({
      assert,
      computed: lazyComputed('key1', getCallback),
      strictEqual: getReturnValue
    });
  });

  test('throws without a func param', function(assert) {
    let func = () => compute({
      computed: lazyComputed()
    });

    assert.throws(func);
  });

  test('function syntax: uses the right context when getting', function(assert) {
    let { subject } = compute({
      computed: lazyComputed(getCallback)
    });

    assert.strictEqual(getCallback.thisValues[0], subject);
  });

  test('function syntax: passes the keys when getting', function(assert) {
    let key2 = alias('key2');
    let { subject } = compute({
      computed: lazyComputed('key1', key2, getCallback)
    });

    // should work but doesn't
    // assert.deepEqual(getCallback.args[0], [
    //   getValue,
    //   { context: subject, key: 'computed', macro: 'key1' },
    //   { context: subject, key: 'computed', macro: alias('key2') }
    // ]);

    assert.equal(getCallback.args.length, 1);
    let args = getCallback.args[0];
    assert.equal(args.length, 3);
    assert.equal(args[0], getValue);
    assert.equal(args[1].context, subject);
    assert.equal(args[1].key, 'computed');
    assert.equal(args[1].macro, 'key1');
    assert.equal(args[2].context, subject);
    assert.equal(args[2].key, 'computed');
    assert.equal(args[2].macro, key2);
  });

  test('function syntax: doesn\'t call when setting', function(assert) {
    let { subject } = compute({
      computed: lazyComputed(getCallback)
    });

    getCallback.reset();

    subject.set('computed', newValue);

    assert.notOk(getCallback.called);
  });

  test('function syntax: preserves set value', function(assert) {
    let { subject } = compute({
      computed: lazyComputed(getCallback)
    });

    getCallback.reset();

    subject.set('computed', newValue);

    assert.strictEqual(subject.get('computed'), newValue);
  });

  test('object syntax: uses the right context when getting', function(assert) {
    let { subject } = compute({
      computed: lazyComputed({
        get: getCallback
      })
    });

    assert.strictEqual(getCallback.thisValues[0], subject);
  });

  test('object syntax: passes the keys when getting', function(assert) {
    let key2 = alias('key2');
    let { subject } = compute({
      computed: lazyComputed('key1', key2, {
        get: getCallback
      })
    });

    // should work but doesn't
    // assert.deepEqual(getCallback.args[0], [
    //   getValue,
    //   { context: subject, key: 'computed', macro: 'key1' },
    //   { context: subject, key: 'computed', macro: alias('key2') }
    // ]);

    assert.equal(getCallback.args.length, 1);
    let args = getCallback.args[0];
    assert.equal(args.length, 3);
    assert.equal(args[0], getValue);
    assert.equal(args[1].context, subject);
    assert.equal(args[1].key, 'computed');
    assert.equal(args[1].macro, 'key1');
    assert.equal(args[2].context, subject);
    assert.equal(args[2].key, 'computed');
    assert.equal(args[2].macro, key2);
  });

  test('object syntax: uses the right context when setting', function(assert) {
    let { subject } = compute({
      computed: lazyComputed({
        get: getCallback,
        set: setCallback
      })
    });

    subject.set('computed', newValue);

    assert.strictEqual(setCallback.thisValues[0], subject);
  });

  test('object syntax: passes the keys when setting', function(assert) {
    let key2 = alias('key2');
    let { subject } = compute({
      computed: lazyComputed('key1', key2, {
        get: getCallback,
        set: setCallback
      })
    });

    subject.set('computed', newValue);

    // should work but doesn't
    // assert.deepEqual(setCallback.args, [[
    //   newValue,
    //   getValue,
    //   { context: subject, key: 'computed', macro: 'key1' },
    //   { context: subject, key: 'computed', macro: alias('key2') }
    // ]]);

    assert.equal(getCallback.args.length, 1);
    let args = setCallback.args[0];
    assert.equal(args.length, 4);
    assert.equal(args[0], newValue);
    assert.equal(args[1], getValue);
    assert.equal(args[2].context, subject);
    assert.equal(args[2].key, 'computed');
    assert.equal(args[2].macro, 'key1');
    assert.equal(args[3].context, subject);
    assert.equal(args[3].key, 'computed');
    assert.equal(args[3].macro, key2);
  });

  test('object syntax: preserves set value', function(assert) {
    let { subject } = compute({
      computed: lazyComputed({
        get: getCallback,
        set: setCallback
      })
    });

    getCallback.reset();

    subject.set('computed', newValue);

    assert.strictEqual(subject.get('computed'), setReturnValue);
  });

  test('function syntax: resolves array [] keys', function(assert) {
    let { subject } = compute({
      computed: lazyComputed('key1.[]', getCallback)
    });

    assert.deepEqual(getCallback.args[0], [
      getValue,
      { context: subject, key: 'computed', macro: 'key1' }
    ]);
  });

  test('function syntax: resolves array @each keys', function(assert) {
    let { subject } = compute({
      computed: lazyComputed('key1.@each.key2', getCallback)
    });

    assert.deepEqual(getCallback.args[0], [
      getValue,
      { context: subject, key: 'computed', macro: 'key1' }
    ]);
  });

  test('function syntax: expands properties', function(assert) {
    let { subject } = compute({
      computed: lazyComputed('{key1,key2}', getCallback)
    });

    assert.deepEqual(getCallback.args[0], [
      getValue,
      { context: subject, key: 'computed', macro: 'key1' },
      { context: subject, key: 'computed', macro: 'key2' }
    ]);
  });

  test('object syntax: resolves array [] keys', function(assert) {
    let { subject } = compute({
      computed: lazyComputed('key1.[]', {
        get: getCallback
      })
    });

    assert.deepEqual(getCallback.args[0], [
      getValue,
      { context: subject, key: 'computed', macro: 'key1' }
    ]);
  });

  test('object syntax: resolves array @each keys', function(assert) {
    let { subject } = compute({
      computed: lazyComputed('key1.@each.key2', {
        get: getCallback
      })
    });

    assert.deepEqual(getCallback.args[0], [
      getValue,
      { context: subject, key: 'computed', macro: 'key1' }
    ]);
  });

  test('object syntax: expands properties', function(assert) {
    let { subject } = compute({
      computed: lazyComputed('{key1,key2}', {
        get: getCallback
      })
    });

    assert.deepEqual(getCallback.args[0], [
      getValue,
      { context: subject, key: 'computed', macro: 'key1' },
      { context: subject, key: 'computed', macro: 'key2' }
    ]);
  });
});
