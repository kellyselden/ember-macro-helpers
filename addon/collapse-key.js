import expandProperty from './expand-property';

export default function(property) {
  if (typeof property !== 'string') {
    return [property];
  }

  let atEachIndex = property.indexOf('@each.');
  if (atEachIndex === -1) {
    atEachIndex = property.indexOf('[]');
  }

  if (atEachIndex === 0) {
    return [''];
  } else if (atEachIndex > 0) {
    return [property.slice(0, atEachIndex - 1)];
  }

  return expandProperty(property);
}
