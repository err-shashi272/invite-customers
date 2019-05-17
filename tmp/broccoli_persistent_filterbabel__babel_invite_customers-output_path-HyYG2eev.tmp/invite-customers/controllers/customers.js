define('invite-customers/controllers/customers', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = _ember.default.computed;
  exports.default = _ember.default.Controller.extend({
    queryParams: ['withinRange'],
    withinRange: true,
    sort: 'userId',

    sortedInfos: computed('model', 'sort', function () {
      return this.get('model').sortBy(this.get('sort'));
    }),

    actions: {
      toggleParams: function toggleParams(param) {
        this.toggleProperty(param);
      },
      sortInfos: function sortInfos() {
        if (this.get('sort') === 'userId') {
          this.set('sort', 'distance');
        } else {
          this.set('sort', 'userId');
        }
      }
    }
  });
});