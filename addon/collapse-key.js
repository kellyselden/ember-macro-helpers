import expandProperty from './expand-property';
import {
  ARRAY_EACH,
  ARRAY_LENGTH
} from './-constants';

export default function(property) {
  if (typeof property !== 'string') {
    return [property];
  }

  let arrayIndex = property.indexOf(ARRAY_EACH);
  if (arrayIndex === -1) {
    arrayIndex = property.indexOf(ARRAY_LENGTH);
  }

  if (arrayIndex === 0) {
    // empty string will be handled later by `getValue`
    // and will convert to `this`
    return [''];
  } else if (arrayIndex > 0) {
    return [property.slice(0, arrayIndex - 1)];
  }

  return expandProperty(property);
}
