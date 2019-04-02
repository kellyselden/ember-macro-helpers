import Controller from '@ember/controller';
import EmberObject, { get } from '@ember/object';
import { A as emberA } from '@ember/array';
import createClassComputed from 'ember-macro-helpers/create-class-computed';
import computed from 'ember-macro-helpers/computed';
import raw from 'ember-macro-helpers/raw';
import normalizeArrayKey from 'ember-macro-helpers/normalize-array-key';

const filterBy = createClassComputed(
  [false, true],
  (arr, key, val) => computed(normalizeArrayKey(arr, [key]), val, (arr, val) => arr.filterBy(key, val))
);

export default Controller.extend({
  array: emberA([
    EmberObject.create({
      testProp: 'test val 1',
      testProp2: 1
    }),
    EmberObject.create({
      testProp: 'test val 2',
      testProp2: 2
    })
  ]),
  index: 0,
  testProp: 'testProp',

  computed: computed(
    filterBy('array', 'testProp', raw('test val 1')),
    array => get(array[array.length - 1], 'testProp2')
  ),

  actions: {
    update() {
      get(this, 'array').pushObject(EmberObject.create({
        testProp: 'test val 1',
        testProp2: 3
      }));
    }
  }
});
