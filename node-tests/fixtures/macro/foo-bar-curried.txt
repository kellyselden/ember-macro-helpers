import curriedComputed from 'ember-macro-helpers/curried-computed';

export default curriedComputed((val1, val2/*, valN... */) => {
  // This is where your normal computed code will go.
  // For example:
  return val1 + val2;
});
