import get from 'ember-metal/get';
import isComputed from './is-computed';

export default function({ context, macro, key } = {}) {
  if (isComputed(macro)) {
    return macro._getter.call(context, key);
  }

  if (typeof macro !== 'string') {
    return macro;
  }

  return get(context, macro);
}
