define('invite-customers/tests/tests.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | tests');

  QUnit.test('acceptance/customers-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/customers-test.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/destroy-app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/destroy-app.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/module-for-acceptance.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/module-for-acceptance.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/resolver.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/start-app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/start-app.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/customer-info-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/customer-info-test.js should pass ESLint\n\n');
  });

  QUnit.test('test-helper.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass ESLint\n\n');
  });

  QUnit.test('unit/models/customer-info-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/customer-info-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/customers-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/customers-test.js should pass ESLint\n\n');
  });
});