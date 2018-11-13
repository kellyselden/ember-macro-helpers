import Component from '@ember/component';
import { get, set, setProperties } from '@ember/object';

export default function({
  assert,
  baseClass = Component,
  computed,
  properties,
  strictEqual,
  deepEqual,
  assertion,
  assertReadOnly
}) {
  let MyComponent = baseClass.extend({
    computed
  });
  let subject;
  try {
    subject = MyComponent.create({
      renderer: {}
    });
  } catch (err) {
    // this is for ember < 2.10
    // can remove once only support 2.12
    subject = MyComponent.create();
  }

  // compute initial value
  // to test recomputes
  get(subject, 'computed');

  setProperties(subject, properties);

  let result = get(subject, 'computed');

  function doAssertion(result) {
    if (assertion) {
      assert.ok(assertion(result));
    } else if (deepEqual) {
      assert.deepEqual(result, deepEqual);
    } else if (assertReadOnly) {
      let func = () => set(subject, 'computed', 'assert read only');
      assert.throws(func, /Cannot set read-only property/);
    } else if (assert) {
      assert.strictEqual(result, strictEqual);
    }
  }

  let promise;
  if (result && typeof result === 'object' && typeof result.then === 'function') {
    promise = result.then(doAssertion);
  } else {
    doAssertion(result);
  }

  return {
    subject,
    result,
    promise
  };
}
