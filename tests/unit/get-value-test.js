import computed from 'ember-computed';
import getValue from 'ember-macro-helpers/get-value';
import getValueUnsafe from 'ember-macro-helpers/get-value-unsafe';
import { module } from 'qunit';
import sinon from 'sinon';
import namedTest from '../helpers/named-test';

module('Unit | Utility | get value');

[
  {
    name: 'getValue',
    getValue
  },
  {
    name: 'getValueUnsafe',
    getValue: getValueUnsafe
  }
].forEach(({ name, getValue }) => {
  function test(title, callback) {
    namedTest(name, title, callback);
  }

  test('it evaluates regular properties', function(assert) {
    let context = {
      testKey: 'test value'
    };

    let value = getValue(context, 'testKey');

    assert.strictEqual(value, 'test value');
  });

  test('it evaluates computed properties', function(assert) {
    let context = {};
    let callback = sinon.stub().returns('test value');
    let key = computed(callback);

    let value = getValue(context, key);

    assert.strictEqual(callback.thisValues[0], context);
    assert.strictEqual(value, 'test value');
  });
});

namedTest('getValue', 'returns undefined if property doesn\'t exist', function(assert) {
  let context = {};

  let value = getValue(context, 'testKey');

  assert.strictEqual(value, undefined);
});

namedTest('getValueUnsafe', 'returns literal if property doesn\'t exist', function(assert) {
  let context = {};

  let value = getValueUnsafe(context, 'testKey');

  assert.strictEqual(value, 'testKey');
});
