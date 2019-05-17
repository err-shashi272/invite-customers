import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    withinRange: { refreshModel: true, replace: true }
  },

  model({ withinRange }) {
    return this.store.query('customer-info', { withinRange });
  }
});
