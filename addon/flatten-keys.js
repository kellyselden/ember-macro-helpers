import isComputed from './is-computed';

function flattenKey(key, flattenedKeys) {
  if (isComputed(key)) {
    let dependentKeys = key._dependentKeys;
    if (dependentKeys === undefined) {
      // when there are no keys (raw)
      return;
    }

    return _flattenKeys(dependentKeys, flattenedKeys);
  }

  if (typeof key !== 'string') {
    return key;
  }

  flattenedKeys.push(key);
}

function _flattenKeys(keys, flattenedKeys) {
  keys.forEach(key => {
    flattenKey(key, flattenedKeys);
  });
}

export default function(keys) {
  let flattenedKeys = [];
  _flattenKeys(keys.slice(0, -1), flattenedKeys);
  let lastKey = keys[keys.length - 1];
  if (lastKey) {
    let lastValue = flattenKey(lastKey, flattenedKeys);
    if (lastValue) {
      if (lastValue.get) {
        flattenKey(lastValue.get, flattenedKeys);
      }
      if (lastValue.set) {
        flattenKey(lastValue.set, flattenedKeys);
      }
    }
  }
  return flattenedKeys;
}
