/* eslint-disable ember/new-module-imports */
import Application from '@ember/application';

import { initialize } from 'dummy/initializers/override-built-in-macros';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop';
import Ember from 'ember';
import { reset } from 'ember-macro-helpers/initializers/override-built-in-macros';
import computedStore from 'ember-macro-helpers/-computed-store';

module('Unit | Initializer | override-built-in-macros', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.TestApplication = Application.extend();
    this.TestApplication.initializer({
      name: 'initializer under test',
      initialize
    });

    this.application = this.TestApplication.create({ autoboot: false });

    reset();
  });

  hooks.afterEach(function() {
    run(this.application, 'destroy');
  });

  test('it wraps Ember.computed', async function(assert) {
    let _computed = Ember.computed;

    // remove after ember 2.18 dropped
    Ember.run(async() => {
      await this.application.boot();
    });

    assert.notEqual(Ember.computed, _computed);
  });

  test('it stores the computed property', async function(assert) {
    let cp = Ember.computed(() => {});

    assert.notOk(computedStore.has(cp));

    // remove after ember 2.18 dropped
    Ember.run(async() => {
      await this.application.boot();
    });

    cp = Ember.computed(() => {});

    assert.ok(computedStore.has(cp));
  });
});
