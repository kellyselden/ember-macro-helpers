import Ember from 'ember';

const { expandProperties } = Ember;

export default function(property) {
  let newPropertyList = [];
  expandProperties(property, expandedProperties => {
    newPropertyList = newPropertyList.concat(expandedProperties);
  });
  return newPropertyList;
}
