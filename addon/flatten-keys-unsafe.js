import flattenKeys from './flatten-keys';

export default function(keys) {
  let flattenedKeys = flattenKeys(keys);

  return flattenedKeys.reduce((flattenedKeys, key) => {
    // keys with spaces throw an exception
    // treat as a literal and ignore
    let hasSpaces = key.indexOf(' ') !== -1;
    if (!hasSpaces) {
      flattenedKeys.push(key);
    }
    return flattenedKeys;
  }, []);
}
