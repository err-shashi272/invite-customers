/* Check customer lat long and invitation*/

import Ember from 'ember';
import CalculateDistance from 'invite-customers/utils/calculate-distance';
import { task } from 'ember-concurrency';

const { computed } = Ember;

export default Ember.Component.extend({
  classNames: ['col', 'min-300', 'card', 'card-outline-primary', 'mb-3', 'text-center'],
  classNameBindings: ['isOutOfReach'],

  distanceFromOffice: computed('customer.{latitude,longitude}', function() {
    let officeCoordinates = { lat: '53.3393', lon: '-6.2576841' };
    return CalculateDistance(officeCoordinates.lat, officeCoordinates.lon, this.get('customer.latitude'), this.get('customer.longitude')).toFixed(2);
  }),

  isOutOfReach: computed.gte('distanceFromOffice', 100),

  inviteCustomerTask: task(function*() {
    let customer = this.get('customer');
    customer.set('invited', true);
    try {
      yield customer.save();
    } catch (e) {
      // Handle error
    }
  }).drop()
});
