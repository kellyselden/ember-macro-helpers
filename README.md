# ember-macro-helpers

[![npm version](https://badge.fury.io/js/ember-macro-helpers.svg)](https://badge.fury.io/js/ember-macro-helpers)
[![Build Status](https://travis-ci.org/kellyselden/ember-macro-helpers.svg?branch=master)](https://travis-ci.org/kellyselden/ember-macro-helpers)

Ember macro helpers for making your own fancy macros!

### API

* [`computed`](#computed)
* [`reads`](#reads)
* [`writable`](#writable)

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

This is also your best friend if you want to make your own macros that support composing out-of-the-box. For example, here is an implementation of a macro that adds two numbers together:

```js
import computed from 'ember-macro-helpers/computed';

export default function(key1, key2) {
  // The incoming keys can be key strings, raw values, or other macros.
  // It makes no difference to you.
  // `computed` will resolve them for you.
  return computed(key1, key2, (value1, value2) => {
    // At this point, the keys no long matter.
    // You are provided the resolved values for you to perform your operation.
    return value1 + value2;
  });
}
```

##### `reads`
alias for [`writable`](#writable)

##### `writable`
This is a setting API for read-only macros.

Given the following read-only macro called `sum`:

```js
import computed from 'ember-macro-helpers/computed';

export default function(key1, key2) {
  return computed(key1, key2, (value1, value2) => {
    return value1 + value2;
  }).readOnly();
}
```

and its usage:

```js
key1: 1,
key2: 2,
result: sum('key1', 'key2')
```

If you try and set `result`, you will get a read-only exception. If you want to bring back the setting functionality, you can wrap it in the `writable` macro:

```js
key1: 1,
key2: 2,
result: writable(sum('key1', 'key2'))
```

Now, setting `result` will remove the macro and replace it with your value. If you want to do something unique when setting, you can provide a set callback:

```js
key1: 1,
key2: 2,
result: writable(sum('key1', 'key2'), {
  set() {
    // do something
    return 'new value';
  }
}), // setting this will not overwrite your macro
```

or:

```js
key1: 1,
key2: 2,
result: writable(sum('key1', 'key2'), function() {
  // do something
  return 'new value';
}) // same as above, but shorthand
```

Setting `result` here will not remove your macro, but will update `result` with the return value.
