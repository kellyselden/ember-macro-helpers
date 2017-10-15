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

  click('button');

  andThen(function() {
    assert.equal(find('.computed').text(), 'test val 3');
  });
});

test('no rerender failing test', function(assert) {
  visit('/no-rerender');

  andThen(function() {
    assert.equal(find('.items').text(), 1);
  });

  click('button');

  andThen(function() {
    assert.equal(find('.items').text(), 0);
  });

  click('button');

  andThen(function() {
    assert.equal(find('.items').text(), 1);
  });
});
