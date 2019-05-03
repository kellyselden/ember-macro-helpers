import ComputedProperty from '@ember/object/computed';

export default function(key) {
  return key instanceof ComputedProperty ||
    typeof key === 'function' && '_getter' in key;
}
