import flattenKeys from 'ember-macro-helpers/flatten-keys';
import flattenKeysUnsafe from 'ember-macro-helpers/flatten-keys-unsafe';
import { module } from 'qunit';
import computed from 'ember-macro-helpers/computed';
import namedTest from '../helpers/named-test';

module('Unit | Utility | flatten keys');

function dummyMacro(...args) {
  args.push(() => {});
  return computed(...args);
}

[
  {
    name: 'flattenKeys',
    flattenKeys
  },
  {
    name: 'flattenKeysUnsafe',
    flattenKeys: flattenKeysUnsafe
  }
].forEach(({ name, flattenKeys }) => {
  function test(title, callback) {
    namedTest(name, title, callback);
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
});

namedTest('flattenKeys', 'it retains keys with spaces', function(assert) {
  let flattenedKeys = flattenKeys(['string with spaces']);

  assert.deepEqual(flattenedKeys, ['string with spaces']);
});

namedTest('flattenKeysUnsafe', 'it removes keys with spaces', function(assert) {
  let flattenedKeys = flattenKeysUnsafe(['string with spaces']);

  assert.deepEqual(flattenedKeys, []);
});
