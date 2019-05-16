import { get } from '@ember/object';
import { isBlank } from '@ember/utils';
import computedStore from './-computed-store';

export default function({ context, macro, key } = {}) {
  let cp = computedStore.get(macro);
  if (cp) {
    return cp.getter.call(context, key);
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
