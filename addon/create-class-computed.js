import Ember from 'ember';
import EmberObject from 'ember-object';
import Component from 'ember-component';
import computed from 'ember-computed';
import on from 'ember-evented/on';
import observer from 'ember-metal/observer';
// import getOwner from 'ember-owner/get';
import get from 'ember-metal/get';
import { setProperties } from 'ember-metal/set';
import WeakMap from 'ember-weakmap';
import getValue from './get-value';
import { collapseKeysWithMap } from './collapse-keys';
import flattenKeys from './flatten-keys';

const { defineProperty } = Ember;

const PROPERTIES = new WeakMap();

function findOrCreatePropertyInstance(context, propertyClass, key, cp) {
  let propertiesForContext = PROPERTIES.get(context);
  if (!propertiesForContext) {
    propertiesForContext = new WeakMap();
    PROPERTIES.set(context, propertiesForContext);
  }

  let property = propertiesForContext.get(cp);
  if (property) {
    return property;
  }

  // let owner = getOwner(context);
  property = propertyClass.create(/*owner.ownerInjection(), */{
    key,
    context,
    nonStrings: EmberObject.create()
  });

  propertiesForContext.set(cp, property);

  if (context instanceof Component) {
    context.one('willDestroyElement', () => {
      property.destroy();
    });
  }

  return property;
}

const BaseClass = EmberObject.extend({
  computedDidChange: observer('computed', function() {
    let { context, key } = this;

    if (context.isDestroying) {
      // controllers can get into this state
      this.destroy();

      return;
    }

    context.notifyPropertyChange(key);
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

    function rewriteComputed(obj, key) {
      let mappedWithResolvedOberverKeys = mappedKeys.map((macro, i) => {
        let shouldObserve = observerBools[i];
        if (shouldObserve) {
          macro = getValue({ context: this, macro, key });
        }
        return macro;
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

      let mappedKey = resolveMappedLocation(key, i);

      mappedKeys.push(mappedKey);
      if (shouldObserve) {
        classProperties[`key${i}DidChange`] = observer(mappedKey, rewriteComputed);
      }
    });

    let ObserverClass = BaseClass.extend(classProperties, {
      // can't use rewriteComputed directly, maybe a bug
      // https://github.com/emberjs/ember.js/issues/15246
      onInit: on('init', function() { rewriteComputed.call(this); })
    });

    let cp = computed(...flattenKeys(keys), function(key) {
      let propertyInstance = findOrCreatePropertyInstance(this, ObserverClass, key, cp);

      let properties = collapsedKeys.reduce((properties, macro, i) => {
        if (typeof macro !== 'string') {
          properties[i.toString()] = getValue({ context: this, macro, key });
        }
        return properties;
      }, {});

      setProperties(propertyInstance.nonStrings, properties);

      return get(propertyInstance, 'computed');
    }).readOnly();

    return cp;
  };
}
