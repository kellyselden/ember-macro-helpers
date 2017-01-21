import curriedComputed from 'ember-macro-helpers/curried-computed';

export default curriedComputed((<% if (useSpread) { %>...values<% } else { %>val1, val2/*, valN... */<% } %>) => {
  // This is where your normal computed code will go.
  // For example:
  return <% if (useSpread) { %>values.reduce((total, val) => total + val)<% } else { %>val1 + val2<% } %>;
});
