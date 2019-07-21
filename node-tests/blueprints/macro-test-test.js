'use strict';

const describe = require('../helpers/describe-blueprint');

describe(
  'Acceptance: ember generate and destroy macro-test',
  'macro-test',
  'fooBar',
  'tests/unit/macros/foo-bar-test.js',
  function(test) {
    // eslint-disable-next-line mocha/no-pending-tests
    test('foo-bar-test.txt');
  }
);
