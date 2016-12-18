import computed from 'ember-computed';

export default function(key) {
  return computed(() => key).readOnly();
}
