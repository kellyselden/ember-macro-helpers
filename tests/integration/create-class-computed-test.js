import createClassComputed from 'ember-macro-helpers/create-class-computed';
import normalizeArrayKey from 'ember-macro-helpers/normalize-array-key';
import lazyComputed from 'ember-macro-helpers/lazy-computed';
import raw from 'ember-macro-helpers/raw';
import { module, test } from 'qunit';
import EmberObject from 'ember-object';
import { A as emberA } from 'ember-array/utils';
import computed from 'ember-computed';
import compute from 'ember-macro-test-helpers/compute';
import WeakMap from 'ember-weakmap';
import sinon from 'sinon';
import destroy from '../helpers/destroy';

let PROPERTIES;
let filterBy;

module('Integration | create class computed', {
  beforeEach() {
    PROPERTIES = new WeakMap();

    filterBy = createClassComputed(
      [false, true, false],
      function(array, key, value) {
        if (!key && typeof array === 'string') {
          PROPERTIES.set(this, array.split('.').reverse()[0]);
        }
        return lazyComputed(normalizeArrayKey(array, [key]), value, function(get, array, value) {
          array = get(array);
          if (array) {
            return array.filterBy(key || PROPERTIES.get(this), get(value));
          }
        });
      }
    );
  }
});

test('it initially calculates correctly', function(assert) {
  let array = emberA([
    EmberObject.create({ test: 'val1' }),
    EmberObject.create({ test: 'val2' })
  ]);

  let { subject } = compute({
    computed: filterBy('array', 'key', 'value'),
    properties: {
      array,
      key: 'test',
      value: 'val1'
    }
  });

  assert.equal(subject.get('computed.length'), 1);
});

test('it responds to array property value changes internally', function(assert) {
  let array = emberA([
    EmberObject.create({ test: 'val1' }),
    EmberObject.create({ test: 'val2' })
  ]);

  let { subject } = compute({
    computed: filterBy('array', 'key', 'value'),
    properties: {
      array,
      key: 'test',
      value: 'val1'
    }
  });

  array.set('1.test', 'val1');

  assert.equal(subject.get('computed.length'), 2);
});

test('it responds to array property value changes externally', function(assert) {
  let array = emberA([
    EmberObject.create({ test: 'val1' }),
    EmberObject.create({ test: 'val2' })
  ]);

  let { subject } = compute({
    computed: filterBy('array.@each.test', 'key', 'value'),
    properties: {
      array,
      value: 'val1'
    }
  });

  array.set('1.test', 'val1');

  assert.equal(subject.get('computed.length'), 2);
});

test('it responds to array property value changes using composing', function(assert) {
  let array = emberA([
    EmberObject.create({ test: 'val1' }),
    EmberObject.create({ test: 'val2' })
  ]);

  let { subject } = compute({
    computed: filterBy(array, raw('test'), raw('val1'))
  });

  array.set('1.test', 'val1');

  assert.equal(subject.get('computed.length'), 2);
});

test('it responds to property value changes using brace expansion', function(assert) {
  let array = emberA([
    EmberObject.create({ test: 'val1' }),
    EmberObject.create({ test: 'val1' })
  ]);

  let { subject } = compute({
    computed: filterBy('obj.{array,key,value}'),
    properties: {
      obj: EmberObject.create({
        array,
        key: 'test',
        value: 'val2'
      })
    }
  });

  subject.set('obj.value', 'val1');

  assert.equal(subject.get('computed.length'), 2);
});

test('it responds to array length changes', function(assert) {
  let array = emberA([
    EmberObject.create({ test: 'val1' }),
    EmberObject.create({ test: 'val2' })
  ]);

  let { subject } = compute({
    computed: filterBy('array', 'key', 'value'),
    properties: {
      array,
      key: 'test',
      value: 'val1'
    }
  });

  array.pushObject(EmberObject.create({ test: 'val1' }));

  assert.equal(subject.get('computed.length'), 2);
});

test('it responds to property key changes', function(assert) {
  let array = emberA([
    EmberObject.create({ test: 'val1' }),
    EmberObject.create({ test: 'val2' })
  ]);

  let { subject } = compute({
    computed: filterBy('array', 'key', 'value'),
    properties: {
      array,
      key: 'test2',
      value: 'val1'
    }
  });

  subject.set('key', 'test');

  assert.equal(subject.get('computed.length'), 1);
});

test('it responds to property value changes', function(assert) {
  let array = emberA([
    EmberObject.create({ test: 'val1' }),
    EmberObject.create({ test: 'val1' })
  ]);

  let { subject } = compute({
    computed: filterBy('array', 'key', 'value'),
    properties: {
      array,
      key: 'test',
      value: 'val2'
    }
  });

  subject.set('value', 'val1');

  assert.equal(subject.get('computed.length'), 2);
});

test('it cleans up after destroy', function(assert) {
  let array = emberA([
    EmberObject.create({ test: 'val1' }),
    EmberObject.create({ test: 'val2' })
  ]);

  let { subject } = compute({
    computed: filterBy('array', 'key', 'value'),
    properties: {
      array,
      key: 'test',
      value: 'val1'
    }
  });

  destroy(subject, () => {
    array.pushObject(EmberObject.create({ test: 'val1' }));

    assert.ok(true);
  });
});

test('it doesn\'t calculate when unnecessary', function(assert) {
  let callback = sinon.spy();

  compute({
    computed: filterBy(
      undefined,
      undefined,
      computed(callback)
    )
  });

  assert.notOk(callback.called);
});
