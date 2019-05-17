import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import CalculateDistance from 'invite-customers/utils/calculate-distance';

let officeCoordinates = { lat: '53.3393', lon: '-6.2576841' };

moduleForComponent('customer-info', 'Integration | Component | Customer Info', {
  integration: true
});

test('it renders customer-info box within range withouth being invited', function(assert) {
  let customer = Ember.Object.create({
    latitude: '52.986375',
    longitude: '-6.043701',
    userId: 12,
    name: 'Christina McArdle',
    invited: false
  });

  let distance = CalculateDistance(officeCoordinates.lat, officeCoordinates.lon, customer.latitude, customer.longitude).toFixed(2);

  this.set('customer', customer);
  this.render(hbs`{{customer-info customer=customer}}`);

  assert.notOk(this.$('.min-300.card').hasClass('is-out-of-reach'), 'The card does not have the `is-out-of-reach` class');
  assert.equal(this.$('.card-blockquote h4').text().trim(), `${customer.name} (${customer.userId})`, 'Correct costumer name rendered');
  assert.ok(this.$('.card-blockquote p').text().trim().includes(`Latitude: ${customer.latitude}`), 'Correct latitude rendered');
  assert.ok(this.$('.card-blockquote p').text().trim().includes(`Longitude: ${customer.longitude}`), 'Correct longitude rendered');
  assert.ok(this.$('.card-blockquote p').text().trim().includes(`Distance from office: ${distance}km`), 'Correct distance rendered');
  assert.ok(this.$('.btn-success').length, 'Invite button rendered');
  this.$('.btn-success').click();
  assert.equal(this.$('.btn-outline-success').attr('disabled'), 'disabled', 'disabled `Invite` button rendered');
});

test('it renders customer-info box out of range', function(assert) {
  let customer = Ember.Object.create({
    latitude: '51.92893',
    longitude: '-10.27699',
    userId: 1,
    name: 'Alice Cahill',
    invited: false
  });

  let distance = CalculateDistance(officeCoordinates.lat, officeCoordinates.lon, customer.latitude, customer.longitude).toFixed(2);

  this.set('customer', customer);
  this.render(hbs`{{customer-info customer=customer}}`);

  assert.ok(this.$('.min-300.card').hasClass('is-out-of-reach'), 'The card has the `is-out-of-reach-class`');
  assert.equal(this.$('.card-blockquote h4').text().trim(), `${customer.name} (${customer.userId})`, 'Correct costumer name rendered');
  assert.ok(this.$('.card-blockquote p').text().trim().includes(`Latitude: ${customer.latitude}`), 'Correct latitude rendered');
  assert.ok(this.$('.card-blockquote p').text().trim().includes(`Longitude: ${customer.longitude}`), 'Correct longitude rendered');
  assert.ok(this.$('.card-blockquote p').text().trim().includes(`Distance from office: ${distance}km`), 'Correct distance rendered');
  assert.equal(this.$('.alert-danger')[0].textContent.trim(), 'Oh snap! this customer is out of reach.', 'Correct text in `alert-danger` rendered');
});
