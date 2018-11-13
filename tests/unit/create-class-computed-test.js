import createClassComputed from 'ember-macro-helpers/create-class-computed';
import computed from 'ember-macro-helpers/computed';
import { module, test } from 'qunit';
import EmberObject from '@ember/object';
import { A as emberA } from '@ember/array';
import sinon from 'sinon';
import { compute } from 'ember-macro-helpers/test-support';
import destroy from '../helpers/destroy';

let callback;

module('Unit | create class computed', function(hooks) {
  hooks.beforeEach(function() {
    callback = sinon.stub().returns('test return value');
  });

  test('it returns the callback response', function(assert) {
    let macro = createClassComputed(
      [],
      () => computed(callback)
    );

    compute({
      assert,
      computed: macro(),
      strictEqual: 'test return value'
    });
  });

  test('it initially calculates correctly', function(assert) {
    let macro = createClassComputed(
      [false],
      test1 => computed(test1, callback)
    );

    compute({
      computed: macro('test2'),
      properties: {
        test2: 'test3'
      }
    });

    assert.deepEqual(callback.args, [
      [undefined],
      ['test3']
    ]);
  });

  test('it still works when you leave off optional observers', function(assert) {
    let macro = createClassComputed(
      [],
      test1 => computed(test1, callback)
    );

    compute({
      computed: macro('test2'),
      properties: {
        test2: 'test3'
      }
    });

    assert.deepEqual(callback.args, [
      [undefined],
      ['test3']
    ]);
  });

  test('it responds to array changes internally', function(assert) {
    let array = emberA([
      EmberObject.create({ test2: 1 }),
      EmberObject.create({ test2: 1 })
    ]);

    let macro = createClassComputed(
      [false],
      test1 => computed(`${test1}.@each.test2`, callback)
    );

    let { subject } = compute({
      computed: macro('test3'),
      properties: {
        test3: array
      }
    });

    array.set('1.test2', 2);

    subject.get('computed');

    assert.equal(callback.callCount, 3);
    assert.deepEqual(emberA(callback.lastCall.args[0]).mapBy('test2'), [1, 2]);
  });

  test('it responds to array changes externally', function(assert) {
    let array = emberA([
      EmberObject.create({ test2: 1 }),
      EmberObject.create({ test2: 1 })
    ]);

    let macro = createClassComputed(
      [false],
      test1 => computed(test1, callback)
    );

    let { subject } = compute({
      computed: macro('test3.@each.test2'),
      properties: {
        test3: array
      }
    });

    array.set('1.test2', 2);

    subject.get('computed');

    assert.equal(callback.callCount, 3);
    assert.deepEqual(emberA(callback.lastCall.args[0]).mapBy('test2'), [1, 2]);
  });

  test('it rewrites when observer changes', function(assert) {
    let array = emberA([
      EmberObject.create({ test2: 1, test6: 2 }),
      EmberObject.create({ test2: 1, test6: 2 })
    ]);

    let observerCallback = sinon.spy(
      (test1, test4) => computed(`${test1}.@each.${test4}`, callback)
    );

    let macro = createClassComputed(
      [false, true],
      observerCallback
    );

    let { subject } = compute({
      computed: macro('test3', 'test5'),
      properties: {
        test3: array,
        test5: 'test2'
      }
    });

    assert.equal(observerCallback.callCount, 2);

    assert.equal(callback.callCount, 2);

    subject.set('test5', 'test6');

    assert.equal(observerCallback.callCount, 3);

    subject.get('computed');

    assert.equal(callback.callCount, 3);

    array.set('1.test6', 3);

    subject.get('computed');

    assert.equal(observerCallback.callCount, 3);

    assert.equal(callback.callCount, 4);
  });

  test('it cleans up after destroy', function(assert) {
    let array = emberA([
      EmberObject.create({ test2: 1 }),
      EmberObject.create({ test2: 1 })
    ]);

    let macro = createClassComputed(
      [false],
      test1 => computed(`${test1}.@each.test2`, callback)
    );

    let { subject } = compute({
      computed: macro('test3'),
      properties: {
        test3: array
      }
    });

    destroy(subject, () => {
      array.set('1.test2', 2);

      assert.equal(callback.callCount, 2);
    });
  });
});
