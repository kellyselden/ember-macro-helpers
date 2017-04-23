import computed from 'ember-computed';

function parseComputedArgs(args) {
  return {
    keys: args.slice(0, -1),
    callback: args[args.length - 1]
  };
}

function buildCallback({ incomingCallback, createArgs }) {
  let newCallback;

  if (typeof incomingCallback === 'function') {
    newCallback = function() {
      return incomingCallback.apply(this, createArgs(this));
    };
  } else {
    newCallback = {};
    if (incomingCallback.get) {
      newCallback.get = function() {
        return incomingCallback.get.apply(this, createArgs(this));
      };
    }
    if (incomingCallback.set) {
      newCallback.set = function(key, value) {
        return incomingCallback.set.call(this, value, ...createArgs(this));
      };
    }
  }

  return newCallback;
}

export default function({ collapseKeys, getValue, flattenKeys, isLazy }) {
  return function(...args) {
    let { keys, callback: incomingCallback } = parseComputedArgs(args);

    let collapsedKeys = collapseKeys(keys);

    function createArgs(context) {
      let bundledKeys = collapsedKeys.map(key => ({ context, key }));
      let values;
      if (isLazy) {
        values = bundledKeys.slice();
        values.splice(0, 0, getValue);
      } else {
        values = bundledKeys.map(getValue);
      }
      return values;
    }

    let newCallback = buildCallback({ incomingCallback, createArgs });

    return computed(...flattenKeys(keys), newCallback);
  }
}

export function buildCurriedComputed(computed) {
  return function(callback) {
    return function() {
      return computed(...arguments, callback).readOnly();
    };
  };
}
