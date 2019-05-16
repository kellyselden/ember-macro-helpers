import computed from './computed';

export default function(key) {
  return computed(() => key).readOnly();
}
