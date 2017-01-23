import computed from './computed';

export default function(callback) {
  return function() {
    return computed(...arguments, callback).readOnly();
  };
}
