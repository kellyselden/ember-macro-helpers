import expandProperty from './expand-property';
import {
  ARRAY_EACH,
  ARRAY_LENGTH
} from './-constants';

function collapseAndPruneDuplicates(expandedProperties) {
  return expandedProperties.map(collapseKey).reduce((properties, collapsedProperties) => {
    let uniqueProperties = collapsedProperties.filter(collapsedProperty => {
      return properties.indexOf(collapsedProperty) === -1;
    });
    return properties.concat(uniqueProperties);
  }, []);
}

export default function collapseKey(property) {
  if (typeof property !== 'string') {
    return [property];
  }

  let expandedProperties = expandProperty(property);
  if (expandedProperties.length > 1) {
    return collapseAndPruneDuplicates(expandedProperties);
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
