import expandProperty from './expand-property';
import {
  ARRAY_EACH,
  ARRAY_LENGTH
} from './-constants';

export default function collapseKey(property) {
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
    if (property.indexOf('{') === -1) {
      return [property.slice(0, arrayIndex - 1)];
    } else {
      let propertyList = [];
      expandProperty(property).forEach(property => {
        let [collapsedProperty] = collapseKey(property);
        if (propertyList.indexOf(collapsedProperty) === -1) {
          propertyList.push(collapsedProperty);
        }
      });
      return propertyList;
    }
  }

  return expandProperty(property);
}
