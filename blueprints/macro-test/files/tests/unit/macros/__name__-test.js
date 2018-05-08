import <%= camelizedModuleName %> from '<%= dasherizedModulePrefix %>/macros/<%= dasherizedModuleName %>';
import { module, test } from 'qunit';
import { compute } from 'ember-macro-test-helpers';

module('<%= friendlyTestName %>', function(hooks) {

  // Replace this with your real tests.
  test('it works', function(assert) {
    compute({
      assert,
      computed: <%= camelizedModuleName %>('key1', 'key2'),
      properties: {
        key1: 1,
        key2: 2
      },
      strictEqual: 3
    });
  });
});
