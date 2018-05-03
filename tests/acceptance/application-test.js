import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | application');

test('double render failing test', function(assert) {
  visit('/double-render');

  andThen(function() {
    assert.equal(find('.computed').text(), 'test val 1');
  });

  click('button');

  andThen(function() {
    assert.equal(find('.computed').text(), 'test val 2');
  });
});

test('no render failing test', function(assert) {
  visit('/no-render');

  andThen(function() {
    assert.equal(find('.item').length, 1);
  });

  click('button');

  andThen(function() {
    assert.equal(find('.item').length, 0);
  });
});
