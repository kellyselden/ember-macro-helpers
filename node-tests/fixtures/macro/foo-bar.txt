import computed from 'ember-macro-helpers/computed';

export default function(key1, key2/*, keyN... */) {
  // This is where you can inspect the incoming keys for errors.
  // For example:
  if (arguments.length < 2) {
    throw new Error('This macro needs two or more arguments.');
  }

  return computed(key1, key2/*, keyN... */, (val1, val2/*, valN... */) => {
    // This is where your normal computed code will go.
    // For example:
    return val1 + val2;
  }).readOnly();
}
