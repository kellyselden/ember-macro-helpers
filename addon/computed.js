import buildComputed from './-build-computed';
import collapseKeys from './collapse-keys';
import getValue from './get-value';
import flattenKeys from './flatten-keys';

export default function(...args) {
  return buildComputed(args, collapseKeys, getValue, flattenKeys);
}
