import computed from 'ember-computed';

function parseComputedArgs(args) {
  return {
    keys: args.slice(0, -1),
    callback: args[args.length - 1]
  };
}

function buildCallback({ collapsedKeys, incomingCallback, getValue }) {
  let newCallback;

  function createArgs(context) {
    let bundledKeys = collapsedKeys.map(key => ({ context, key }));
    return bundledKeys.map(getValue);
  }

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

export default function({ args, collapseKeys, getValue, flattenKeys }) {
  let { keys, callback: incomingCallback } = parseComputedArgs(args);

  let collapsedKeys = collapseKeys(keys);

  let newCallback = buildCallback({ collapsedKeys, incomingCallback, getValue });

  return computed(...flattenKeys(keys), newCallback);
}
