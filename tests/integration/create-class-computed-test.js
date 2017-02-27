import createClassComputed from 'ember-macro-helpers/create-class-computed';
import { module, test } from 'qunit';
import EmberObject from 'ember-object';
import { A as emberA } from 'ember-array/utils';
import computed from 'ember-macro-helpers/computed';
import compute from 'ember-macro-test-helpers/compute';

let filterBy;

module('Integration | create class computed', {
  beforeEach() {
    filterBy = createClassComputed(
      {
        array: false,
        key: true,
        value: false
      },
      key => {
        return computed(`array.@each.${key}`, 'value', (array, value) => {
          if (array) {
            return array.filterBy(key, value);
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

test('it responds to array property value changes', function(assert) {
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
