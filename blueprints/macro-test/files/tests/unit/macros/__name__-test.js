import <%= camelizedModuleName %> from '<%= dasherizedModulePrefix %>/macros/<%= dasherizedModuleName %>';
import compute from 'ember-macro-test-helpers/compute';
import { module, test } from 'qunit';

module('<%= friendlyTestName %>');

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
