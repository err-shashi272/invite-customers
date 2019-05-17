define('invite-customers/components/customer-info', ['exports', 'ember', 'invite-customers/utils/calculate-distance', 'ember-concurrency'], function (exports, _ember, _calculateDistance, _emberConcurrency) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = _ember.default.computed;
  exports.default = _ember.default.Component.extend({
    classNames: ['col', 'min-300', 'card', 'card-outline-primary', 'mb-3', 'text-center'],
    classNameBindings: ['isOutOfReach'],

    distanceFromOffice: computed('customer.{latitude,longitude}', function () {
      var officeCoordinates = { lat: '53.3393', lon: '-6.2576841' };
      return (0, _calculateDistance.default)(officeCoordinates.lat, officeCoordinates.lon, this.get('customer.latitude'), this.get('customer.longitude')).toFixed(2);
    }),

    isOutOfReach: computed.gte('distanceFromOffice', 100),

    inviteCustomerTask: (0, _emberConcurrency.task)(regeneratorRuntime.mark(function _callee() {
      var customer;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              customer = this.get('customer');

              customer.set('invited', true);
              _context.prev = 2;
              _context.next = 5;
              return customer.save();

            case 5:
              _context.next = 9;
              break;

            case 7:
              _context.prev = 7;
              _context.t0 = _context['catch'](2);

            case 9:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[2, 7]]);
    })
    // Handle error
    ).drop()
  });
});