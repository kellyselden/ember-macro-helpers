import get from 'ember-metal/get';
import isComputed from './is-computed';

export default function({ context, macro } = {}) {
  if (isComputed(macro)) {
    return macro._getter.call(context);
  }

  if (typeof macro !== 'string') {
    return macro;
  }

  return get(context, macro);
}
