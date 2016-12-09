import Ember from 'ember';

const { expandProperties } = Ember;

export default function(property) {
  let atEachIndex = property.indexOf('.@each');
  if (atEachIndex !== -1) {
    return [property.slice(0, atEachIndex)];
  } else if (property.slice(-2) === '[]') {
    return [property.slice(0, -3)];
  }

  let newPropertyList = [];
  expandProperties(property, expandedProperties => {
    newPropertyList = newPropertyList.concat(expandedProperties);
  });
  return newPropertyList;
}
