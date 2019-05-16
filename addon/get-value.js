import { get } from '@ember/object';
import { isBlank } from '@ember/utils';
import isComputed from './is-computed';
import { getComputedData } from './-build-computed';

export default function({ context, macro, key } = {}) {
  if (isComputed(macro)) {
    let { getter } = getComputedData(macro);
    return getter.call(context, key);
  }

  if (typeof macro !== 'string') {
    return macro;
  }

  if (isBlank(macro)) {
    // the macro was `[]' or `@each.key', which has been trimmed, leaving a
    // blank string, so return the context (which is likely an ArrayProxy)
    return context;
  }

  return get(context, macro);
}
