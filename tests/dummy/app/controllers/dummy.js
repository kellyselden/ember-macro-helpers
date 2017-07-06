import Controller from '@ember/controller';
import raw from 'ember-macro-helpers/raw';
import mapBy from 'dummy/macros/map-by';

export default Controller.extend({
  childNames: mapBy('model.children', raw('name'))
});
