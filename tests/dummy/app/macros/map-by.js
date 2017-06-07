import createClassComputed from 'ember-macro-helpers/create-class-computed';
import computed from 'ember-macro-helpers/computed';

export default createClassComputed(
  [false, true],
  (array, key) => {
    return computed(array, array => {
      return array.mapBy(key);
    });
  }
);
