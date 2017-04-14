import collapseKey from './collapse-key';

export function collapseKeysWithMap(keys) {
  let collapsedKeys = [];

  keys.forEach(key => {
    let array = collapseKey(key);

    collapsedKeys = collapsedKeys.concat(array);
  });

  return {
    collapsedKeys
  }
}

export default function(keys) {
  return collapseKeysWithMap(keys).collapsedKeys;
}
