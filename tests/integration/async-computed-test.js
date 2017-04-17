import asyncComputed from 'ember-macro-helpers/async-computed';
import { timeout } from 'ember-concurrency';
import { module, test } from 'qunit';
// comment out the first get in here
import compute from 'ember-macro-test-helpers/compute';
import Ember from 'ember';

module('Integration | async computed');

test('restartable', function(assert) {
  Ember.Logger.error = () => {};

  let { subject } = compute({
    computed: asyncComputed('test1', function * (test1) {
      yield timeout(1000);
      return test1 + 1;
    }).restartable(),
    properties: {
      test1: 1
    }
  });

  let firstCall = subject.get('computed');

  subject.set('test1', 2);

  let secondCall = subject.get('computed');

  let didFirstCallThrow;

  return firstCall.catch(() => {
    didFirstCallThrow = true;

    return secondCall;
  }).then(result => {
    assert.strictEqual(result, 3);

    assert.ok(didFirstCallThrow);
  });
});

test('drop', function(assert) {
  Ember.Logger.error = () => {};

  let { subject } = compute({
    computed: asyncComputed('test1', function * (test1) {
      yield timeout(1000);
      return test1 + 1;
    }).drop(),
    properties: {
      test1: 1
    }
  });

  let firstCall = subject.get('computed');

  subject.set('test1', 2);

  let secondCall = subject.get('computed');

  let didSecondCallThrow;

  return secondCall.catch(() => {
    didSecondCallThrow = true;

    return firstCall;
  }).then(result => {
    assert.strictEqual(result, 2);

    assert.ok(didSecondCallThrow);
  });
});
