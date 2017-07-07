import expandProperty from './expand-property';

export default function(property) {
  if (typeof property !== 'string') {
    return [property];
  }

  let arrayIndex = property.indexOf('@each.');
  if (arrayIndex === -1) {
    arrayIndex = property.indexOf('[]');
  }

  if (arrayIndex === 0) {
    return [''];
  } else if (arrayIndex > 0) {
    return [property.slice(0, arrayIndex - 1)];
  }

  return expandProperty(property);
}
