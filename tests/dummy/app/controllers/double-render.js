import Controller from '@ember/controller';
import EmberObject from '@ember/object';
import { A as emberA } from '@ember/array';
import { readOnly } from '@ember/object/computed';
import createClassComputed from 'ember-macro-helpers/create-class-computed';
import computed from 'ember-macro-helpers/computed';

const getBy = createClassComputed(
  [false, true],
  (obj, key) => readOnly(`${obj}.${key}`)
);

export default Controller.extend({
  array: emberA([
    EmberObject.create({
      testProp: 'test val 1'
    }),
    EmberObject.create({
      testProp: 'test val 2'
    }),
    EmberObject.create({
      testProp: 'test val 3'
    })
  ]),
  index: 0,
  testProp: 'testProp',

  computed: getBy(
    computed('array', 'index', (array, index) => array.objectAt(index)),
    'testProp'
  ),

  actions: {
    update() {
      this.incrementProperty('index');
    }
  }
});
