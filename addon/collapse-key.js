import expandProperty from './expand-property';

export default function(property) {
  if (typeof property !== 'string') {
    return [property];
  }

  let atEachIndex = property.indexOf('.@each');
  if (atEachIndex !== -1) {
    return [property.slice(0, atEachIndex)];
  } else if (property.slice(-2) === '[]') {
    return [property.slice(0, -3)];
  }

  return expandProperty(property);
}
