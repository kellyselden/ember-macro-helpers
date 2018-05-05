import { computed } from '@ember/object';
import getValue from 'ember-macro-helpers/get-value';
import getValueUnsafe from 'ember-macro-helpers/get-value-unsafe';
import { module } from 'qunit';
import sinon from 'sinon';
import namedTest from '../helpers/named-test';

module('Unit | get value', function() {
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

    test('it returns undefined if no params', function(assert) {
      let value = getValue();

      assert.strictEqual(value, undefined);
    });

    test('it returns undefined if undefined', function(assert) {
      let value = getValue(undefined);

      assert.strictEqual(value, undefined);
    });

    test('it returns undefined if empty object', function(assert) {
      let value = getValue({});

      assert.strictEqual(value, undefined);
    });

    test('it evaluates regular properties', function(assert) {
      let context = {
        testKey: 'test value'
      };

      let value = getValue({ context, macro: 'testKey' });

      assert.strictEqual(value, 'test value');
    });

    test('it evaluates computed properties', function(assert) {
      let context = {};
      let callback = sinon.stub().returns('test value');
      let macro = computed(callback);
      let key = 'computedName';

      let value = getValue({ context, macro, key });

      assert.strictEqual(callback.thisValues[0], context);
      assert.deepEqual(callback.args[0], [key]);
      assert.strictEqual(value, 'test value');
    });

    test('calulates false value consistently', function(assert) {
      let context = {
        testKey: false
      };

      let value = getValue({ context, macro: 'testKey' });

      assert.strictEqual(value, false);
    });

    test('returns the context if the macro is blank', function(assert) {
      let context = {
        testKey: 'test value'
      };

      let value = getValue({ context, macro: '' });

      assert.strictEqual(value, context);
    });
  });

  namedTest('getValue', 'returns undefined if property doesn\'t exist', function(assert) {
    let context = {};

    let value = getValue({ context, macro: 'testKey' });

    assert.strictEqual(value, undefined);
  });

  namedTest('getValueUnsafe', 'returns literal if property doesn\'t exist', function(assert) {
    let context = {};

    let value = getValueUnsafe({ context, macro: 'testKey' });

    assert.strictEqual(value, 'testKey');
  });
});
