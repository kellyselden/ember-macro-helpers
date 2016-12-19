# ember-macro-helpers

[![npm version](https://badge.fury.io/js/ember-macro-helpers.svg)](https://badge.fury.io/js/ember-macro-helpers)
[![Build Status](https://travis-ci.org/kellyselden/ember-macro-helpers.svg?branch=master)](https://travis-ci.org/kellyselden/ember-macro-helpers)

Ember macro helpers for making your own fancy macros!

### API

* [`computed`](#computed)

##### `computed`
`computed` behaves like [`Ember.computed`](http://emberjs.com/api/classes/Ember.computed.html) with some extra benefits.

It will pass you resolved values:

```js
import Ember from 'ember';
import computed from 'ember-macro-helpers/computed';

export default Ember.Component.extend({
  key: 'my value',

  computed: computed('key', value => {
    console.log(value); // 'my value'
    // do something else
  })
});
```

You can compose using any of Ember's built-in macros:

```js
import Ember from 'ember';
import computed from 'ember-macro-helpers/computed';

export default Ember.Component.extend({
  key1: false,
  key2: true,

  computed: computed(Ember.computed.or('key1', 'key2'), value => {
    console.log(value); // true
    // do something else
  })
});
```

or you can compose using a macro library like [`ember-awesome-macros`](https://github.com/kellyselden/ember-awesome-macros)

```js
import Ember from 'ember';
import computed from 'ember-macro-helpers/computed';
import conditional from 'ember-awesome-macros/conditional';
import sum from 'ember-awesome-macros/sum';
import difference from 'ember-awesome-macros/difference';

export default Ember.Component.extend({
  key1: 345678,
  key2: 785572,

  computed: computed(conditional(gt('key1', 'key2'), sum('key1', 'key2'), difference('key1', 'key2')), value => {
    console.log(value); // -439894
    // do something else
  })
});
```

It respects enumerable helpers:

```js
import Ember from 'ember';
import computed from 'ember-macro-helpers/computed';

export default Ember.Component.extend({
  key1: [{ key2: 1 }, { key2: 2 }],

  computed1: computed('key1.[]', value => {
    console.log(value); // [{ key2: 1 }, { key2: 2 }]
    // do something else
  }),
  computed2: computed('key1.@each.key2', value => {
    console.log(value); // [{ key2: 1 }, { key2: 2 }]
    // do something else
  }),
});
```

It respects enumerable helpers:

```js
import Ember from 'ember';
import computed from 'ember-macro-helpers/computed';

export default Ember.Component.extend({
  key1: [{ key2: 1 }, { key2: 2 }],

  computed1: computed('key1.[]', value => {
    console.log(value); // [{ key2: 1 }, { key2: 2 }]
    // do something else
  }),
  computed2: computed('key1.@each.key2', value => {
    console.log(value); // [{ key2: 1 }, { key2: 2 }]
    // do something else
  }),
});
```

It resolves property expansion for you:

```js
import Ember from 'ember';
import computed from 'ember-macro-helpers/computed';

export default Ember.Component.extend({
  key1: { key2: 1, key3: 2 },

  computed: computed('key1.{key2,key3}', (value1, value2) => {
    console.log(value1); // 1
    console.log(value2); // 2
    // do something else
  })
});
```
