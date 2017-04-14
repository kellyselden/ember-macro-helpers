import Ember from 'ember';
import EmberObject from 'ember-object';
import computed from 'ember-computed';
import on from 'ember-evented/on';
import observer from 'ember-metal/observer';
import { isNone } from 'ember-utils';
// import getOwner from 'ember-owner/get';
import get from 'ember-metal/get';
import { setProperties } from 'ember-metal/set';
import WeakMap from 'ember-weakmap';
import { mapKeysToValues } from './-build-computed';
import getValue from './get-value';
import collapseKeys from './collapse-keys';
import flattenKeys from './flatten-keys';

const { defineProperty } = Ember;

const PROPERTIES = new WeakMap();

function findOrCreatePropertyInstance(context, propertyClass, key) {
  let propertiesForContext = PROPERTIES.get(context);
  if (isNone(propertiesForContext)) {
    propertiesForContext = {};
    PROPERTIES.set(context, propertiesForContext);
  }

  let property = propertiesForContext[key];
  if (property) {
    return property;
  }

  // let owner = getOwner(context);
  property = propertyClass.create(/*owner.ownerInjection(), */{
    _key: key,
    _context: context
  });

  propertiesForContext[key] = property;
  return property;
}

const BaseClass = EmberObject.extend({
  _computedDidChange: observer('_computed', function() {
    this._context.notifyPropertyChange(this._key);
  })
});

function createObserverClass(classKeysObj, macroGenerator) {
  let classKeys = Object.keys(classKeysObj);
  let observers = classKeys.filter(key => classKeysObj[key]);

  function rewriteComputed() {
    let values = mapKeysToValues(observers, getValue, this);
    let cp = macroGenerator(...values);
    defineProperty(this, '_computed', cp);
  }

  let classProperties = observers.reduce((properties, key) => {
    properties[`${key}DidChange`] = observer(key, rewriteComputed);
    return properties;
  }, {});

  return BaseClass.extend(classProperties, {
    _onInit: on('init', rewriteComputed)
  });
}

function createComputed(classKeysObj, ObserverClass) {
  let classKeys = Object.keys(classKeysObj);

  return function(...keys) {
    let collapsedKeys = collapseKeys(keys);

    return computed(...flattenKeys(keys), function(key) {
      let propertyInstance = findOrCreatePropertyInstance(this, ObserverClass, key);

      let properties = collapsedKeys.reduce((properties, key, i) => {
        properties[classKeys[i]] = getValue(this, key);
        return properties;
      }, {});

      setProperties(propertyInstance, properties);

      return get(propertyInstance, '_computed');
    }).readOnly();
  };
}

export default function(classKeysObj, macroGenerator) {
  let ObserverClass = createObserverClass(classKeysObj, macroGenerator);

  return createComputed(classKeysObj, ObserverClass);
}
