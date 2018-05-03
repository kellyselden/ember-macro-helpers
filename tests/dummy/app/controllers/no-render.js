import Controller from '@ember/controller';
import EmberObject from '@ember/object';
import { A as emberA } from '@ember/array';
import createClassComputed from 'ember-macro-helpers/create-class-computed';
import computed from 'ember-macro-helpers/computed';

const filterBy = createClassComputed(
  [false, true],
  (array, key) => computed(`${array}.@each.${key}`, (array) => array.filterBy(key))
);

export default Controller.extend({
  originalItems: emberA([
    EmberObject.create({
      state: true
    })
  ]),
  prop: 'state',
  items: filterBy('originalItems', 'prop'),

  actions: {
    update() {
      this.set('originalItems.0.state', false);
    }
  }
});
