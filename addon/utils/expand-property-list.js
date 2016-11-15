import Ember from 'ember';

const { expandProperties } = Ember;

export default function(propertyList) {
  return propertyList.reduce((newPropertyList, property) => {
    let atEachIndex = property.indexOf('.@each');
    if (atEachIndex !== -1) {
      return newPropertyList.concat(property.slice(0, atEachIndex));
    } else if (property.slice(-2) === '[]') {
      return newPropertyList.concat(property.slice(0, -3));
    }

    expandProperties(property, expandedProperties => {
      newPropertyList = newPropertyList.concat(expandedProperties);
    });

    return newPropertyList;
  }, []);
}
