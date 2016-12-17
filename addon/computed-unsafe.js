import buildComputed from './-build-computed';
import getValue from './get-value-unsafe';

export default function(...args) {
  return buildComputed(args, getValue);
}
