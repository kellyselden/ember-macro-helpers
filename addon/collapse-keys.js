import collapseKey from './collapse-key';

export function collapseKeysWithMap(keys) {
  let collapsedKeys = [];
  let keyMap = [];

  keys.forEach(key => {
    let array = collapseKey(key);

    collapsedKeys = collapsedKeys.concat(array);

    let i;
    if (keyMap.length) {
      i = keyMap[keyMap.length - 1] + 1;
    } else {
      i = 0;
    }
    keyMap = keyMap.concat(array.map(() => i));
  });

  return {
    collapsedKeys,
    keyMap
  };
}

export default function(keys) {
  return collapseKeysWithMap(keys).collapsedKeys;
}
