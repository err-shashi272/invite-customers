define('invite-customers/tests/integration/components/customer-info-test', ['ember', 'ember-qunit', 'invite-customers/utils/calculate-distance'], function (_ember, _emberQunit, _calculateDistance) {
  'use strict';

  var officeCoordinates = { lat: '53.3393', lon: '-6.2576841' };

  (0, _emberQunit.moduleForComponent)('customer-info', 'Integration | Component | Customer Info', {
    integration: true
  });

  (0, _emberQunit.test)('it renders customer-info box within range withouth being invited', function (assert) {
    var customer = _ember.default.Object.create({
      latitude: '52.986375',
      longitude: '-6.043701',
      userId: 12,
      name: 'Christina McArdle',
      invited: false
    });

    var distance = (0, _calculateDistance.default)(officeCoordinates.lat, officeCoordinates.lon, customer.latitude, customer.longitude).toFixed(2);

    this.set('customer', customer);
    this.render(_ember.default.HTMLBars.template({
      "id": "/gG+l2sX",
      "block": "{\"statements\":[[1,[33,[\"customer-info\"],null,[[\"customer\"],[[28,[\"customer\"]]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.notOk(this.$('.min-300.card').hasClass('is-out-of-reach'), 'The card does not have the `is-out-of-reach` class');
    assert.equal(this.$('.card-blockquote h4').text().trim(), customer.name + ' (' + customer.userId + ')', 'Correct costumer name rendered');
    assert.ok(this.$('.card-blockquote p').text().trim().includes('Latitude: ' + customer.latitude), 'Correct latitude rendered');
    assert.ok(this.$('.card-blockquote p').text().trim().includes('Longitude: ' + customer.longitude), 'Correct longitude rendered');
    assert.ok(this.$('.card-blockquote p').text().trim().includes('Distance from office: ' + distance + 'km'), 'Correct distance rendered');
    assert.ok(this.$('.btn-success').length, 'Invite button rendered');
    this.$('.btn-success').click();
    assert.equal(this.$('.btn-outline-success').attr('disabled'), 'disabled', 'disabled `Invite` button rendered');
  });

  (0, _emberQunit.test)('it renders customer-info box out of range', function (assert) {
    var customer = _ember.default.Object.create({
      latitude: '51.92893',
      longitude: '-10.27699',
      userId: 1,
      name: 'Alice Cahill',
      invited: false
    });

    var distance = (0, _calculateDistance.default)(officeCoordinates.lat, officeCoordinates.lon, customer.latitude, customer.longitude).toFixed(2);

    this.set('customer', customer);
    this.render(_ember.default.HTMLBars.template({
      "id": "/gG+l2sX",
      "block": "{\"statements\":[[1,[33,[\"customer-info\"],null,[[\"customer\"],[[28,[\"customer\"]]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.ok(this.$('.min-300.card').hasClass('is-out-of-reach'), 'The card has the `is-out-of-reach-class`');
    assert.equal(this.$('.card-blockquote h4').text().trim(), customer.name + ' (' + customer.userId + ')', 'Correct costumer name rendered');
    assert.ok(this.$('.card-blockquote p').text().trim().includes('Latitude: ' + customer.latitude), 'Correct latitude rendered');
    assert.ok(this.$('.card-blockquote p').text().trim().includes('Longitude: ' + customer.longitude), 'Correct longitude rendered');
    assert.ok(this.$('.card-blockquote p').text().trim().includes('Distance from office: ' + distance + 'km'), 'Correct distance rendered');
    assert.equal(this.$('.alert-danger')[0].textContent.trim(), 'Oh snap! this customer is out of reach.', 'Correct text in `alert-danger` rendered');
  });
});