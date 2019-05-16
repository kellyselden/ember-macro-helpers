/* eslint-disable ember/new-module-imports */
import Ember from 'ember';
import computedStore from '../-computed-store';

const _computed = Ember.computed;

export function initialize() {
  Ember.computed = function computed(...args) {
    let cp = _computed.apply(this, args);
    let dependentKeys = args.slice(0, args.length - 1);
    let getter = args[args.length - 1];
    computedStore.set(cp, { dependentKeys, getter });
    return cp;
  };
  Object.assign(Ember.computed, _computed);
}

export function reset() {
  Ember.computed = _computed;
}

export default {
  initialize
};
