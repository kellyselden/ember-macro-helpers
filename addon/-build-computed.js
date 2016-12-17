import computed from 'ember-computed';

function parseComputedArgs(args) {
  return {
    keys: args.slice(0, -1),
    callback: args[args.length - 1]
  };
}

function mapKeysToValues(keys, getValue, context) {
  return keys.map(key => getValue(context, key));
}

function buildCallback(collapsedKeys, incomingCallback, getValue) {
  let newCallback;
  if (typeof incomingCallback === 'function') {
    newCallback = function() {
      let values = mapKeysToValues(collapsedKeys, getValue, this);
      return incomingCallback.apply(this, values);
    };
  } else {
    newCallback = {};
    if (incomingCallback.get) {
      newCallback.get = function() {
        let values = mapKeysToValues(collapsedKeys, getValue, this);
        return incomingCallback.get.apply(this, values);
      };
    }
    if (incomingCallback.set) {
      newCallback.set = incomingCallback.set;
    }
  }

  return newCallback;
}

export default function(args, collapseKeys, getValue, flattenKeys) {
  let { keys, callback: incomingCallback } = parseComputedArgs(args);

  let collapsedKeys = collapseKeys(keys);

  let newCallback = buildCallback(collapsedKeys, incomingCallback, getValue);

  return computed(...flattenKeys(keys), newCallback);
}
