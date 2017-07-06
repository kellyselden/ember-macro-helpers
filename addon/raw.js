import { computed } from '@ember/object';

export default function(key) {
  return computed(() => key).readOnly();
}
