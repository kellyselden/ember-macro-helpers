'use strict';

const describe = require('../helpers/describe-blueprint');

describe(
  'Acceptance: ember generate and destroy macro',
  'macro',
  'fooBar',
  'app/macros/foo-bar.js',
  function(test) {
    test('foo-bar.txt');
    test('foo-bar-spread.txt', '--use-spread');
    test('foo-bar-curried.txt', '--use-curried');
    test('foo-bar-curried-spread.txt', '--use-curried', '--use-spread');
  }
);
