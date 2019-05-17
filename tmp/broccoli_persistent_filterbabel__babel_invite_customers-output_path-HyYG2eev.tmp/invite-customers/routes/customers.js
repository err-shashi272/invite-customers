define('invite-customers/routes/customers', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _ember.default.Route.extend({
    queryParams: {
      withinRange: { refreshModel: true, replace: true }
    },

    model: function model(_ref) {
      var withinRange = _ref.withinRange;

      return this.store.query('customer-info', { withinRange: withinRange });
    }
  });
});