import reads from 'ember-macro-helpers/reads';
import raw from 'ember-macro-helpers/raw';
import computed from 'ember-macro-helpers/computed';
import { module, test } from 'qunit';
import sinon from 'sinon';
import { compute } from 'ember-macro-test-helpers';

const getReturnValue = 'get return value test';
const setReturnValue = 'set return value test';
const newValue = 'new value test';

let setCallback;

module('Integration | reads', function(hooks) {
  hooks.beforeEach(function() {
    setCallback = sinon.stub().returns(setReturnValue);
  });

  function alias(key) {
    return computed(key, val => val);
  }

  test('without setter: passes through the getter', function(assert) {
    compute({
      assert,
      computed: reads('key'),
      properties: {
        key: getReturnValue
      },
      strictEqual: getReturnValue
    });
  });

  test('without setter: allows computed keys', function(assert) {
    compute({
      assert,
      computed: reads(raw(getReturnValue)),
      strictEqual: getReturnValue
    });
  });

  test('without setter: allows setting', function(assert) {
    let { subject } = compute({
      computed: reads(raw(getReturnValue))
    });

    subject.set('computed', newValue);

    assert.strictEqual(subject.get('computed'), newValue);
  });

  test('without setter: is no longer a computed', function(assert) {
    let { subject } = compute({
      computed: reads('key'),
      properties: {
        key: false
      }
    });

    subject.set('computed', false);
    subject.set('key', true);

    assert.strictEqual(subject.get('computed'), false);
  });

  test('with function setter: passes through the getter', function(assert) {
    compute({
      assert,
      computed: reads('key', setCallback),
      properties: {
        key: getReturnValue
      },
      strictEqual: getReturnValue
    });
  });

  test('with function setter: allows computed keys', function(assert) {
    compute({
      assert,
      computed: reads(raw(getReturnValue), setCallback),
      strictEqual: getReturnValue
    });
  });

  test('with function setter: `this` is object context', function(assert) {
    let { subject } = compute({
      computed: reads(raw(getReturnValue), setCallback)
    });

    subject.set('computed', newValue);

    assert.strictEqual(setCallback.thisValues[0], subject);
  });

  test('with function setter: passes the value when setting', function(assert) {
    let { subject } = compute({
      computed: reads(alias('key'), setCallback),
      properties: {
        key: '123'
      }
    });

    subject.set('computed', newValue);

    assert.deepEqual(setCallback.args, [[newValue, '123']]);
  });

  test('with function setter: setter return value is new value', function(assert) {
    let { subject } = compute({
      computed: reads(raw(getReturnValue), setCallback)
    });

    subject.set('computed', newValue);

    assert.strictEqual(subject.get('computed'), setReturnValue);
  });

  test('with function setter: is still a computed', function(assert) {
    let { subject } = compute({
      computed: reads('key', setCallback),
      properties: {
        key: false
      }
    });

    subject.set('computed', false);
    subject.set('key', true);

    assert.strictEqual(subject.get('computed'), true);
  });

  test('with object setter: passes through the getter', function(assert) {
    compute({
      assert,
      computed: reads('key', {
        set: setCallback
      }),
      properties: {
        key: getReturnValue
      },
      strictEqual: getReturnValue
    });
  });

  test('with object setter: allows computed keys', function(assert) {
    compute({
      assert,
      computed: reads(raw(getReturnValue), {
        set: setCallback
      }),
      strictEqual: getReturnValue
    });
  });

  test('with object setter: `this` is object context', function(assert) {
    let { subject } = compute({
      computed: reads(raw(getReturnValue), {
        set: setCallback
      })
    });

    subject.set('computed', newValue);

    assert.strictEqual(setCallback.thisValues[0], subject);
  });

  test('with object setter: passes the value when setting', function(assert) {
    let { subject } = compute({
      computed: reads(alias('key'), {
        set: setCallback
      }),
      properties: {
        key: '123'
      }
    });

    subject.set('computed', newValue);

    assert.deepEqual(setCallback.args, [[newValue, '123']]);
  });

  test('with object setter: setter return value is new value', function(assert) {
    let { subject } = compute({
      computed: reads(raw(getReturnValue), {
        set: setCallback
      })
    });

    subject.set('computed', newValue);

    assert.strictEqual(subject.get('computed'), setReturnValue);
  });

  test('with object setter: is still a computed', function(assert) {
    let { subject } = compute({
      computed: reads('key', {
        set: setCallback
      }),
      properties: {
        key: false
      }
    });

    subject.set('computed', false);
    subject.set('key', true);

    assert.strictEqual(subject.get('computed'), true);
  });
});
