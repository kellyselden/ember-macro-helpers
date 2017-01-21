import curriedComputed from 'ember-macro-helpers/curried-computed';

export default curriedComputed((...values) => {
  // This is where your normal computed code will go.
  // For example:
  return values.reduce((total, val) => total + val);
});
