import { computed } from 'ember-macro-helpers';

export default function(<% if (useSpread) { %>...keys<% } else { %>key1, key2/*, keyN... */<% } %>) {
  // This is where you can inspect the incoming keys for errors.
  // For example:
  if (<% if (useSpread) { %>keys<% } else { %>arguments<% } %>.length < 2) {
    throw new Error('This macro needs two or more arguments.');
  }

  return computed(<% if (useSpread) { %>...keys<% } else { %>key1, key2/*, keyN... */<% } %>, (<% if (useSpread) { %>...values<% } else { %>val1, val2/*, valN... */<% } %>) => {
    // This is where your normal computed code will go.
    // For example:
    return <% if (useSpread) { %>values.reduce((total, val) => total + val)<% } else { %>val1 + val2<% } %>;
  }).readOnly();
}
