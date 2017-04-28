import buildComputed from './-build-computed';
import collapseKeys from './collapse-keys';
import getValue from './get-value';
import flattenKeys from './flatten-keys';

export default buildComputed({ collapseKeys, getValue, flattenKeys });
