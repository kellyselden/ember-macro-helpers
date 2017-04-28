import buildComputed from './-build-computed';
import getValue from './get-value-unsafe';
import flattenKeys from './flatten-keys-unsafe';

const collapseKeys = keys => keys;

export default buildComputed({ collapseKeys, getValue, flattenKeys });
