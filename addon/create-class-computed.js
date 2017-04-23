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
import getValue from './get-value';
import { collapseKeysWithMap } from './collapse-keys';
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
    key,
    context,
    nonStrings: EmberObject.create()
  });

  propertiesForContext[key] = property;

  context.one('willDestroyElement', () => {
    property.destroy();
    delete propertiesForContext[key];
    if (!Object.getOwnPropertyNames(propertiesForContext).length) {
        PROPERTIES.delete(context);
    }
  });

  return property;
}

const BaseClass = EmberObject.extend({
  computedDidChange: observer('computed', function() {
    this.context.notifyPropertyChange(this.key);
  })
});

function resolveMappedLocation(key, i) {
  if (typeof key === 'string') {
    return `context.${key}`;
  } else {
    return `nonStrings.${i}`;
  }
}

export default function(observerBools, macroGenerator) {
  return function(...keys) {
    let { collapsedKeys, keyMap } = collapseKeysWithMap(keys);

    function getOriginalArrayDecorator(key, i) {
      if (typeof key === 'string') {
        let originalKey = keys[keyMap[i]];
        if (originalKey.indexOf('.[]') !== -1 || originalKey.indexOf('.@each') !== -1) {
          return originalKey;
        }
      }
      return key;
    }

    let mappedKeys = [];

    function rewriteComputed() {
      let mappedWithResolvedOberverKeys = mappedKeys.map((key, i) => {
        let shouldObserve = observerBools[i];
        if (shouldObserve) {
          key = getValue({ context: this, key });
        }
        return key;
      });

      let cp = macroGenerator.apply(this, mappedWithResolvedOberverKeys);
      defineProperty(this, 'computed', cp);
    }

    let classProperties = {};

    collapsedKeys.forEach((key, i) => {
      let shouldObserve = observerBools[i];
      if (!shouldObserve) {
        key = getOriginalArrayDecorator(key, i);
      }

      key = resolveMappedLocation(key, i);

      mappedKeys.push(key);
      if (shouldObserve) {
        classProperties[`key${i}DidChange`] = observer(key, rewriteComputed);
      }
    });

    let ObserverClass = BaseClass.extend(classProperties, {
      onInit: on('init', rewriteComputed)
    });

    return computed(...flattenKeys(keys), function(key) {
      let propertyInstance = findOrCreatePropertyInstance(this, ObserverClass, key);

      let properties = collapsedKeys.reduce((properties, key, i) => {
        if (typeof key !== 'string') {
          properties[i.toString()] = getValue({ context: this, key });
        }
        return properties;
      }, {});

      setProperties(propertyInstance.nonStrings, properties);

      return get(propertyInstance, 'computed');
    }).readOnly();
  };
}
