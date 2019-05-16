import { getComputedData } from './-build-computed';

export default function(key) {
  return Boolean(getComputedData(key));
}
