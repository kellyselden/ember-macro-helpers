import { expandProperties } from '@ember/object/computed';

export default function(property) {
  let newPropertyList = [];
  expandProperties(property, expandedProperties => {
    newPropertyList = newPropertyList.concat(expandedProperties);
  });
  return newPropertyList;
}
