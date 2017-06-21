import computed from 'ember-macro-helpers/computed';
import computedUnsafe from 'ember-macro-helpers/computed-unsafe';
import { module } from 'qunit';
import sinon from 'sinon';
import compute from 'ember-macro-test-helpers/compute';
import namedTest from '../helpers/named-test';
import ArrayProxy from '@ember/array/proxy';
import { A as emberA } from '@ember/array';

const getReturnValue = 'get return value test';
const setReturnValue = 'set return value test';
const newValue = 'new value test';

let getCallback;
let setCallback;

module('Integration | computed', {
  beforeEach() {
    getCallback = sinon.stub().returns(getReturnValue);
    setCallback = sinon.stub().returns(setReturnValue);
  }
});

function alias(key) {
  return computed(key, val => val);
}

[
  {
    name: 'computed',
    computed
  },
  {
    name: 'computedUnsafe',
    computed: computedUnsafe
  }
].forEach(({ name, computed }) => {
  function test(title, callback) {
    namedTest(name, title, callback);
  }

  test('works with no key', function(assert) {
    compute({
      assert,
      computed: computed(getCallback),
      strictEqual: getReturnValue
    });
  });

  test('works with undefined key', function(assert) {
    compute({
      assert,
      computed: computed('key1', getCallback),
      strictEqual: getReturnValue
    });
  });

  test('throws without a func param', function(assert) {
    let func = () => compute({
      computed: computed()
    });

    assert.throws(func);
  });

  test('function syntax: uses the right context when getting', function(assert) {
    let { subject } = compute({
      computed: computed(getCallback)
    });

    assert.strictEqual(getCallback.thisValues[0], subject);
  });

  test('function syntax: passes the values when getting', function(assert) {
    compute({
      computed: computed('key1', alias('key2'), getCallback),
      properties: {
        key1: '123',
        key2: '456'
      }
    });

    assert.deepEqual(getCallback.args[1], ['123', '456']);
  });

  test('function syntax: doesn\'t call when setting', function(assert) {
    let { subject } = compute({
      computed: computed(getCallback)
    });

    getCallback.reset();

    subject.set('computed', newValue);

    assert.notOk(getCallback.called);
  });

  test('function syntax: preserves set value', function(assert) {
    let { subject } = compute({
      computed: computed(getCallback)
    });

    getCallback.reset();

    subject.set('computed', newValue);

    assert.strictEqual(subject.get('computed'), newValue);
  });

  test('object syntax: uses the right context when getting', function(assert) {
    let { subject } = compute({
      computed: computed({
        get: getCallback
      })
    });

    assert.strictEqual(getCallback.thisValues[0], subject);
  });

  test('object syntax: passes the values when getting', function(assert) {
    compute({
      computed: computed('key1', alias('key2'), {
        get: getCallback
      }),
      properties: {
        key1: '123',
        key2: '456'
      }
    });

    assert.deepEqual(getCallback.args[1], ['123', '456']);
  });

  test('object syntax: uses the right context when setting', function(assert) {
    let { subject } = compute({
      computed: computed({
        get: getCallback,
        set: setCallback
      })
    });

    subject.set('computed', newValue);

    assert.strictEqual(setCallback.thisValues[0], subject);
  });

  test('object syntax: passes the values when setting', function(assert) {
    let { subject } = compute({
      computed: computed('key1', alias('key2'), {
        get: getCallback,
        set: setCallback
      }),
      properties: {
        key1: '123',
        key2: '456'
      }
    });

    subject.set('computed', newValue);

    assert.deepEqual(setCallback.args, [[newValue, '123', '456']]);
  });

  test('object syntax: preserves set value', function(assert) {
    let { subject } = compute({
      computed: computed({
        get: getCallback,
        set: setCallback
      })
    });

    getCallback.reset();

    subject.set('computed', newValue);

    assert.strictEqual(subject.get('computed'), setReturnValue);
  });
});

namedTest('computed', 'function syntax: resolves array [] keys', function(assert) {
  compute({
    computed: computed('key1.[]', getCallback),
    properties: {
      key1: '123'
    }
  });

  assert.deepEqual(getCallback.args[1], ['123']);
});

namedTest('computed', 'function syntax: resolves ArrayProxy []', function(assert) {
  compute({
    baseClass: ArrayProxy,
    computed: computed('[]', getCallback),
    properties: {
      content: emberA(['123'])
    }
  });

  assert.deepEqual(getCallback.args[1][0].toArray(), ['123']);
});

namedTest('computed', 'function syntax: resolves array @each keys', function(assert) {
  compute({
    computed: computed('key1.@each.key2', getCallback),
    properties: {
      key1: '123'
    }
  });

  assert.deepEqual(getCallback.args[1], ['123']);
});

namedTest('computed', 'function syntax: resolves ArrayProxy @each', function(assert) {
  compute({
    baseClass: ArrayProxy,
    computed: computed('@each.key1', getCallback),
    properties: {
      content: emberA([{ key1: '123' }])
    }
  });

  assert.deepEqual(getCallback.args[1][0].toArray(), [{ key1: '123' }]);
});

namedTest('computed', 'function syntax: expands properties', function(assert) {
  compute({
    computed: computed('{key1,key2}', getCallback),
    properties: {
      key1: '123',
      key2: '456'
    }
  });

  assert.deepEqual(getCallback.args[1], ['123', '456']);
});

namedTest('computed', 'function syntax: passes undefined if property doesn\'t exist', function(assert) {
  compute({
    computed: computed('key1', getCallback)
  });

  assert.deepEqual(getCallback.args, [[undefined]]);
});

namedTest('computed', 'object syntax: resolves array [] keys', function(assert) {
  compute({
    computed: computed('key1.[]', {
      get: getCallback
    }),
    properties: {
      key1: '123'
    }
  });

  assert.deepEqual(getCallback.args[1], ['123']);
});

namedTest('computed', 'object syntax: resolves array @each keys', function(assert) {
  compute({
    computed: computed('key1.@each.key2', {
      get: getCallback
    }),
    properties: {
      key1: '123'
    }
  });

  assert.deepEqual(getCallback.args[1], ['123']);
});

namedTest('computed', 'object syntax: expands properties', function(assert) {
  compute({
    computed: computed('{key1,key2}', {
      get: getCallback
    }),
    properties: {
      key1: '123',
      key2: '456'
    }
  });

  assert.deepEqual(getCallback.args[1], ['123', '456']);
});

namedTest('computed', 'object syntax: passes undefined if property doesn\'t exist', function(assert) {
  compute({
    computed: computed('key1', {
      get: getCallback
    })
  });

  assert.deepEqual(getCallback.args, [[undefined]]);
});

namedTest('computedUnsafe', 'function syntax: passes literal if property doesn\'t exist', function(assert) {
  compute({
    computed: computedUnsafe('literal with spaces', getCallback)
  });

  assert.deepEqual(getCallback.args, [['literal with spaces']]);
});

namedTest('computedUnsafe', 'object syntax: passes literal if property doesn\'t exist', function(assert) {
  compute({
    computed: computedUnsafe('literal with spaces', {
      get: getCallback
    })
  });

  assert.deepEqual(getCallback.args, [['literal with spaces']]);
});
