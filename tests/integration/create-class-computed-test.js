import createClassComputed from 'ember-macro-helpers/create-class-computed';
import normalizeArrayKey from 'ember-macro-helpers/normalize-array-key';
import computed from 'ember-macro-helpers/computed';
import raw from 'ember-macro-helpers/raw';
import { module, test } from 'qunit';
import EmberObject from 'ember-object';
import { A as emberA } from 'ember-array/utils';
import compute from 'ember-macro-test-helpers/compute';
import WeakMap from 'ember-weakmap';
import destroy from '../helpers/destroy';

let PROPERTIES;
let filterBy;

module('Integration | create class computed', {
  beforeEach() {
    PROPERTIES = new WeakMap();

    filterBy = createClassComputed(
      [false, true, false],
      function(array, key, value) {
        if (!key) {
          PROPERTIES.set(this, array.split('.').reverse()[0]);
        }
        return computed(normalizeArrayKey(array, [key]), value, function(array, value) {
          if (array) {
            return emberA(emberA(array).filterBy(key || PROPERTIES.get(this), value));
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

test('it responds to array property value changes using raw array', function(assert) {
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

test('composing: macros still compute inside', function(assert) {
  let array1 = emberA([
    EmberObject.create({ test: 'val1' }),
    EmberObject.create({ test: 'val1' })
  ]);
  let array2 = emberA([
    EmberObject.create({ test: 'val1' }),
    EmberObject.create({ test: 'val2' })
  ]);

  let { subject } = compute({
    computed: filterBy(computed('innerKey', innerKey => innerKey ? array1 : array2), 'key', 'value'),
    properties: {
      innerKey: true,
      key: 'test',
      value: 'val1'
    }
  });

  assert.equal(subject.get('computed.length'), 2);

  subject.set('innerKey', false);

  assert.equal(subject.get('computed.length'), 1);
});

test('composing: it responds to array property value changes', function(assert) {
  let array = emberA([
    EmberObject.create({ test: 'val1' }),
    EmberObject.create({ test: 'val2' })
  ]);

  let { subject } = compute({
    computed: filterBy(computed(() => array), 'key', 'value'),
    properties: {
      key: 'test',
      value: 'val1'
    }
  });

  assert.equal(subject.get('computed.length'), 1);

  array.set('1.test', 'val1');

  assert.equal(subject.get('computed.length'), 2);
});

test('composing: it responds to property key changes', function(assert) {
  let array = emberA([
    EmberObject.create({ test: 'val1' }),
    EmberObject.create({ test: 'val2' })
  ]);

  let { subject } = compute({
    computed: filterBy(computed(() => array), 'key', 'value'),
    properties: {
      array,
      key: 'test2',
      value: 'val1'
    }
  });

  assert.equal(subject.get('computed.length'), 0);

  subject.set('key', 'test');

  assert.equal(subject.get('computed.length'), 1);
});

test('composing: it responds to property value changes', function(assert) {
  let array = emberA([
    EmberObject.create({ test: 'val1' }),
    EmberObject.create({ test: 'val1' })
  ]);

  let { subject } = compute({
    computed: filterBy(computed(() => array), 'key', 'value'),
    properties: {
      array,
      key: 'test',
      value: 'val2'
    }
  });

  assert.equal(subject.get('computed.length'), 0);

  subject.set('value', 'val1');

  assert.equal(subject.get('computed.length'), 2);
});

test('composing: macros still compute outside', function(assert) {
  let array1 = emberA([
    EmberObject.create({ test: 'val1' }),
    EmberObject.create({ test: 'val1' })
  ]);
  let array2 = emberA([
    EmberObject.create({ test: 'val1' }),
    EmberObject.create({ test: 'val2' })
  ]);

  let { subject } = compute({
    computed: computed(filterBy('array', 'key', 'value'), array => array),
    properties: {
      array: array1,
      key: 'test',
      value: 'val1'
    }
  });

  assert.equal(subject.get('computed.length'), 2);

  subject.set('array', array2);

  assert.equal(subject.get('computed.length'), 1);
});

test('composing: both macros are class computed', function(assert) {
  let array = emberA([
    EmberObject.create({ id: 1, test1: 'val1', test2: 'val1' }),
    EmberObject.create({ id: 2, test1: 'val2', test2: 'val1' }),
    EmberObject.create({ id: 3, test1: 'val2', test2: 'val2' }),
    EmberObject.create({ id: 3, test1: 'val1', test2: 'val2' })
  ]);

  let { subject } = compute({
    computed: filterBy(filterBy('array', 'key1', 'value1'), 'key2', 'value2'),
    properties: {
      array,
      key1: 'test1',
      key2: 'test2',
      value1: 'val1',
      value2: 'val1'
    }
  });

  assert.deepEqual(subject.get('computed').mapBy('id'), [1]);
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
