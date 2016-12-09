import buildComputed from './-build-computed';
import getValueUnsafe from './get-value-unsafe';

export default function(...args) {
  return buildComputed(args, getValueUnsafe);
}
