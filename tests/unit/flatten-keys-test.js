import flattenKeys from 'ember-macro-helpers/flatten-keys';
import { module, test } from 'qunit';
import computed from 'ember-macro-helpers/computed';

module('Unit | Utility | flatten keys');

function dummyMacro(...args) {
  args.push(() => {});
  return computed(...args);
}

test('it works', function(assert) {
  let key1 = 'test1';
  let key2 = dummyMacro('test2', dummyMacro('test3', 'test4'));

  let flattenedKeys = flattenKeys([key1, key2]);

  assert.deepEqual(flattenedKeys, [
    'test1',
    'test2',
    'test3',
    'test4'
  ]);
});

test('it handles undefined _dependentKeys (raw)', function(assert) {
  let key = dummyMacro();

  let flattenedKeys = flattenKeys([key]);

  assert.deepEqual(flattenedKeys, []);
});
