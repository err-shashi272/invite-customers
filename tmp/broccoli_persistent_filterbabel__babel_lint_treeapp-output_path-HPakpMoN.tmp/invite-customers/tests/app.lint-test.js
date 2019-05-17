define('invite-customers/tests/app.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | app');

  QUnit.test('app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass ESLint\n\n');
  });

  QUnit.test('components/customer-info.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/customer-info.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/customers.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/customers.js should pass ESLint\n\n');
  });

  QUnit.test('models/customer-info.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/customer-info.js should pass ESLint\n\n');
  });

  QUnit.test('resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass ESLint\n\n');
  });

  QUnit.test('router.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass ESLint\n\n');
  });

  QUnit.test('routes/customers.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/customers.js should pass ESLint\n\n');
  });

  QUnit.test('utils/calculate-distance.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'utils/calculate-distance.js should pass ESLint\n\n');
  });

  QUnit.test('utils/flatten-array.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'utils/flatten-array.js should pass ESLint\n\n');
  });
});