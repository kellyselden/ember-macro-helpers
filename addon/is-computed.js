import Ember from 'ember';

const { ComputedProperty } = Ember;

export default function(key) {
  return key instanceof ComputedProperty;
}
