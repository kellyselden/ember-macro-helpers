ember-macro-helpers
==============================================================================

[![Greenkeeper badge](https://badges.greenkeeper.io/kellyselden/ember-macro-helpers.svg)](https://greenkeeper.io/)
[![npm version](https://badge.fury.io/js/ember-macro-helpers.svg)](https://badge.fury.io/js/ember-macro-helpers)
[![Build Status](https://travis-ci.org/kellyselden/ember-macro-helpers.svg?branch=master)](https://travis-ci.org/kellyselden/ember-macro-helpers)
[![Ember Version](https://img.shields.io/badge/ember-2.12%2B-brightgreen.svg)](https://www.emberjs.com/)

Ember macro helpers for making your own fancy macros!

Check out the following projects to see this addon in use:

* https://github.com/kellyselden/ember-awesome-macros
* https://github.com/ember-decorators/ember-decorators
* https://github.com/stefanpenner/ember-moment
* https://github.com/cibernox/ember-cpm

Installation
------------------------------------------------------------------------------

```
ember install ember-macro-helpers
```


Usage
------------------------------------------------------------------------------

```
import nameOfMacro from 'ember-macro-helpers/name-of-macro';
// or
import { nameOfMacro } from 'ember-macro-helpers';
```

### Contents
  - [API](#api)
  - [Custom macros](#custom-macros)

### API

* [`computed`](#computed)
* [`createClassComputed`](#createclasscomputed)
* [`curriedComputed`](#curriedcomputed)
* [`lazyComputed`](#lazycomputed)
* [`lazyCurriedComputed`](#lazycurriedcomputed)
* [`literal`](#literal)
* [`raw`](#raw)
* [`reads`](#reads)
* [`writable`](#writable)

##### `computed`
`computed` behaves like [`Ember.computed`](http://emberjs.com/api/classes/Ember.computed.html) with some extra benefits.

It will pass you resolved values:

```js
import Component from '@ember/component';
import computed from 'ember-macro-helpers/computed';

export default Component.extend({
  key: 'my value',

  result: computed('key', {
    get(value) {
      console.log(value); // 'my value'
      // do something else
    },
    set(newValue, value) {
      console.log(newValue); // 'new value'
      console.log(value); // 'my value'
      return newValue;
    }
  }),

  actions: {
    doSomething() {
      this.set('result', 'new value');
    }
  }
});
```

You can compose using any of Ember's built-in macros:

```js
import Component from '@ember/component';
import { or } from '@ember/object/computed';
import computed from 'ember-macro-helpers/computed';

export default Component.extend({
  key1: false,
  key2: true,

  result: computed(or('key1', 'key2'), value => {
    console.log(value); // true
    // do something else
  })
});
```

or you can compose using a macro library like [`ember-awesome-macros`](https://github.com/kellyselden/ember-awesome-macros):

```js
import Component from '@ember/component';
import computed from 'ember-macro-helpers/computed';
import { conditional, gt, sum, difference } from 'ember-awesome-macros';

export default Component.extend({
  key1: 345678,
  key2: 785572,

  result: computed(conditional(gt('key1', 'key2'), sum('key1', 'key2'), difference('key1', 'key2')), value => {
    console.log(value); // -439894
    // do something else
  })
});
```

It respects enumerable helpers:

```js
import Component from '@ember/component';
import computed from 'ember-macro-helpers/computed';

export default Component.extend({
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
import Component from '@ember/component';
import computed from 'ember-macro-helpers/computed';

export default Component.extend({
  key1: { key2: 1, key3: 2 },

  result: computed('key1.{key2,key3}', (value1, value2) => {
    console.log(value1); // 1
    console.log(value2); // 2
    // do something else
  })
});
```

This is also your best friend if you want to make your own macros that support composing out-of-the-box.

For example, here is an implementation of a macro that adds two numbers together:

```js
// app/macros/add.js
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

Then you can use it like this:

```js
import Component from '@ember/component';
import add from 'my-app/macros/add';

export default Component.extend({
  key1: 12,
  key2: 34,
  key3: 56,

  result: add(add('key1', 'key2'), add('key3', 78)) // 180
});
```

##### `createClassComputed`
This creates a class-based computed. This is useful when not the value, but the key being watched is variable. It rewrites your computed property when needed.

See [ember-classy-computed](https://github.com/simplabs/ember-classy-computed) for the inspiration source.

If you want an array macro that will respond when someone changes the array property they want to watch:

```js
// app/macros/filter-by.js
import createClassComputed from 'ember-macro-helpers/create-class-computed';
import computed from 'ember-macro-helpers/computed';

export default createClassComputed(
  // the first param is the observer list
  // it refers to incoming keys
  // the bool is whether a value change should recreate the macro
  [
    // the array key
    false,

    // the array property is dynamic, and is responsible for the macro being rewritten
    true,

    // any static properties after the last dynamic property are optional
    // you could leave this off if you want
    false
  ],
  // the second param is the callback function where you create your computed property
  // it is passed in the values of the properties you marked true above
  (array, key, value) => {
    // when `key` changes, we need to watch a new property on the array
    // since our computed property is now invalid, we need to create a new one
    return computed(`${array}.@each.${key}`, value, (array, value) => {
      return array.filterBy(key, value);
    });
  }
);
```

And then we consume this macro like normal:

```js
import Component from '@ember/component';
import { A as emberA } from '@ember/array';
import EmberObject from '@ember/object';
import filterBy from 'my-app/macros/filter-by';

export default Component.extend({
  myArray: emberA([
    EmberObject.create({ myProp: 0 }),
    EmberObject.create({ myProp: 1 })
  ]),

  // this could change at any time and our macro would pick it up
  myKey: 'myProp',

  result: filterBy('myArray', 'myKey', 1)
});
```

##### `curriedComputed`
This is a shorthand version of [`computed`](#computed). It allows you to create macros like this:

```js
// app/macros/add.js
import curriedComputed from 'ember-macro-helpers/curried-computed';

export default curriedComputed(function(value1, value2) {
  // At this point, the keys no long matter.
  // You are provided the resolved values for you to perform your operation.
  return value1 + value2;
});
```

##### `lazyComputed`
This is the lazy resolving version of [`computed`](#computed). The difference is instead of being provided the resolved values, you are provided the unresolved keys and a resolving function. This is useful if you want to optimize your macros and have early returns without calculating every key eagerly.

The API differs only slightly from [`computed`](#computed):

```js
// app/macros/and.js
import lazyComputed from 'ember-macro-helpers/lazy-computed';

export default function(key1, key2) {
  return lazyComputed(key1, key2, (get, key1, key2) => {
    // Where normally you get the values, now you have to calculate yourself.
    // The second key won't calculate if the first resolved value is falsy.
    return get(key1) && get(key2);
  });
}
```

##### `lazyCurriedComputed`
This is the combination of [`lazyComputed`](#lazycomputed) and [`curriedComputed`](#curriedcomputed).

##### `literal`
alias for [`raw`](#raw)

##### `raw`
This allows you to escape string literals to be used in macros.

Normally, a string means it will look up the property on the object context:

```js
import Component from '@ember/component';
import computed from 'ember-macro-helpers/computed';

export default Component.extend({
  key: 'value',

  result: computed('key', value => {
    console.log(value); // 'value'
    // do something else
  })
});
```

But if you just want to use the value without making an object property, you can use the `raw` macro:

```js
import Component from '@ember/component';
import computed from 'ember-macro-helpers/computed';
import raw from 'ember-macro-helpers/raw';

export default Component.extend({
  key: 'value',

  // Even though we are using a string that is the same name as a property on the object,
  // the `raw` macro will ignore the object property and treat the string as a literal.
  result: computed(raw('key'), value => {
    console.log(value); // 'key'
    // do something else
  })
});
```

The usefulness is more apparent when using complex macros, for example, when using the string [`split`](https://github.com/kellyselden/ember-awesome-macros#stringsplit) macro from `ember-awesome-macros`:

```js
import Component from '@ember/component';
import raw from 'ember-macro-helpers/raw';
import split from 'ember-awesome-macros/array/split';

export default Component.extend({
  key: '1, 2, 3',

  result: split('key', raw(', ')) // [1, 2, 3]
});
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

If you try and set `result`, you will get a read-only exception.

If you want to bring back the setting functionality, you can wrap it in the `writable` macro:

```js
key1: 1,
key2: 2,
result: writable(sum('key1', 'key2'))
```

Now, setting `result` will remove the macro and replace it with your value.

If you want to do something unique when setting, you can provide a set callback:

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

### Custom macros
The addon provides a way of creating your own custom macros. The easiest way is
to use the blueprint generator:

````sh
ember generate macro my-custom-macro
````

This will generate an example macro and its associated test. The comments in
these files will get you started.

More explanation is given in the [introduction video](https://youtu.be/kIDIa1NBZZI?t=18m40s).


Contributing
------------------------------------------------------------------------------

### Installation

* `git clone <repository-url>`
* `cd ember-macro-helpers`
* `npm install`

### Linting

* `npm run lint:js`
* `npm run lint:js -- --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `ember try:each` – Runs the test suite against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
