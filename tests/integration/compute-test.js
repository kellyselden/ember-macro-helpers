import EmberObject from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { resolve } from 'rsvp';
import { compute } from 'ember-macro-helpers/test-support';
import { module, test } from 'qunit';

module('Integration | compute', function() {
  module('verify API', function() {
    test('it works without properties', function(assert) {
      compute({
        assert,
        computed: readOnly('key'),
        strictEqual: undefined
      });
    });

    test('it accepts a different base class', function(assert) {
      compute({
        assert,
        baseClass: EmberObject.extend({
          foo: 'bar'
        }),
        computed: readOnly('foo'),
        strictEqual: 'bar'
      });
    });

    test('it uses properties to calculate value', function(assert) {
      compute({
        assert,
        computed: readOnly('key'),
        properties: {
          key: 'test value'
        },
        strictEqual: 'test value'
      });
    });

    test('it will deep equal', function(assert) {
      compute({
        assert,
        computed: readOnly('key'),
        properties: {
          key: ['test value']
        },
        deepEqual: ['test value']
      });
    });

    test('it will allow you to calculate the assertion', function(assert) {
      compute({
        assert,
        computed: readOnly('key'),
        properties: {
          key: ['test value']
        },
        assertion([value]) {
          return value === 'test value';
        }
      });
    });

    test('it can assert readOnly', function(assert) {
      compute({
        assert,
        computed: readOnly('key'),
        assertReadOnly: true
      });
    });

    test('it is promise-aware', function(assert) {
      return compute({
        assert,
        computed: readOnly('key'),
        properties: {
          key: resolve('test value')
        },
        strictEqual: 'test value'
      }).promise;
    });

    test('it returns result', function(assert) {
      let { result } = compute({
        computed: readOnly('key'),
        properties: {
          key: 'test value'
        }
      });

      assert.strictEqual(result, 'test value');
    });

    test('it returns subject', function(assert) {
      let { subject } = compute({
        computed: readOnly('key'),
        properties: {
          key: 'test value'
        }
      });

      assert.strictEqual(subject.get('computed'), 'test value');
    });
  });

  module('edge cases', function() {
    test('it handles special case null', function(assert) {
      compute({
        assert,
        computed: readOnly('key'),
        properties: {
          key: null
        },
        strictEqual: null
      });
    });
  });
});
