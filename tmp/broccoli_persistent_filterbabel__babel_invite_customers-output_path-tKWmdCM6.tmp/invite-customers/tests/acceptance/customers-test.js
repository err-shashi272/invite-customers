define('invite-customers/tests/acceptance/customers-test', ['qunit', 'invite-customers/tests/helpers/module-for-acceptance'], function (_qunit, _moduleForAcceptance) {
  'use strict';

  (0, _moduleForAcceptance.default)('Acceptance | Customers');

  (0, _qunit.test)('visiting /customers', function (assert) {
    visit('/');

    andThen(function () {
      var correctOrderedIds = '4,5,6,8,11,12,13,15,17,23,24,26,29,30,31,39';
      var ids = [];
      find('.min-300.card h4').map(function (_, element) {
        ids.push(element.textContent.replace(/\D+/g, ''));
      });
      assert.equal(currentURL(), '/');
      assert.equal(find('.min-300.card').length, 16, 'Correct number of customers rendered (16)');
      assert.equal(find('.action-buttons .btn-outline-primary').length, 2, '2 action buttons rendered');
      assert.equal(find('.btn.btn-success').length, 13, '13 not invited buttons rendered');
      assert.equal(find('.btn.btn-outline-success').length, 3, '3 invited buttons rendered');
      assert.equal(ids.join(','), correctOrderedIds, 'Correctly ordered (by User-ID)');

      click('.action-buttons .btn-outline-primary:eq(1)');
    });

    andThen(function () {
      var correctOrderedDIstances = '1055,2327,2407,3812,3834,4175,4371,4428,6222,7221,8265,8271,8354,8904,9609,9886';
      var distances = [];
      find('.min-300.card .distance').map(function (_, element) {
        distances.push(element.textContent.replace(/\D+/g, ''));
      });

      assert.equal(distances.join(','), correctOrderedDIstances, 'Correctly ordered (by distance)');
      click('.action-buttons .btn-outline-primary:eq(0)');
    });

    andThen(function () {
      assert.equal(find('.min-300.card').length, 32, 'Correct number of customers rendered (32)');
    });
  });
});