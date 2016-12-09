import buildComputed from './-build-computed';
import getValue from './get-value';

export default function(...args) {
  return buildComputed(args, getValue);
}
