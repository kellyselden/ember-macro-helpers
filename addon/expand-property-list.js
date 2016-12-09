import expandProperty from './expand-property';

export default function(propertyList) {
  return propertyList.reduce((newPropertyList, property) => {
    return newPropertyList.concat(expandProperty(property));
  }, []);
}
