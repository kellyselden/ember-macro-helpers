import computedStore from './-computed-store';

function flattenKey(key, flattenedKeys) {
  let cp = computedStore.get(key);
  if (cp) {
    return _flattenKeys(cp.dependentKeys, flattenedKeys);
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
