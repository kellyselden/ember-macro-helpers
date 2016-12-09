import get from 'ember-metal/get';
import isComputed from './is-computed';

export default function(context, key) {
  if (isComputed(key)) {
    return key._getter.call(context);
  }

  if (typeof key !== 'string') {
    return key;
  }

  return get(context, key);
}
