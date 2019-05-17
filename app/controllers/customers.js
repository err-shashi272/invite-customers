/* Controller customer to sort customer info on basis of user id or distance */
import Ember from 'ember';

const { computed } = Ember;

export default Ember.Controller.extend({
  queryParams: ['withinRange'],
  withinRange: true,
  sort: 'userId',

  sortedInfos: computed('model', 'sort', function() {
    return this.get('model').sortBy(this.get('sort'));
  }),

  actions:{
    toggleParams(param) {
      this.toggleProperty(param);
    },

    sortInfos() {
      if (this.get('sort') === 'userId') {
        this.set('sort', 'distance');
      } else {
        this.set('sort', 'userId');
      }
    }
  }
});
