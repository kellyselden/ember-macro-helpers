import Ember from 'ember';
import raw from 'ember-macro-helpers/raw';
import mapBy from 'dummy/macros/map-by';

export default Ember.Controller.extend({
  childNames: mapBy('model.children', raw('name'))
});
