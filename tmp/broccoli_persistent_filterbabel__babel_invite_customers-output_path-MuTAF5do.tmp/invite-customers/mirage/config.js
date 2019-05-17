define('invite-customers/mirage/config', ['exports', 'invite-customers/utils/calculate-distance'], function (exports, _calculateDistance) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function () {
    // this.timing = 2000; // Uncomment to see the is the `inviting...` effect

    this.get('/customer-infos', function (db, req) {
      var officeCoordinates = { lat: '53.3393', lon: '-6.2576841' };
      var filteredInfos = db.customerInfos.all().models;
      filteredInfos.forEach(function (info) {
        return info.attrs.distance = (0, _calculateDistance.default)(officeCoordinates.lat, officeCoordinates.lon, info.latitude, info.longitude);
      });
      if (req.queryParams.withinRange === 'true') {
        // This is not a boolean, mirage converts it to a string
        filteredInfos = filteredInfos.filter(function (info) {
          return info.attrs.distance <= 100;
        });
      }
      return {
        data: filteredInfos.map(function (attributes) {
          return {
            type: 'customer-info',
            id: attributes.id,
            attributes: attributes
          };
        })
      };
    });
    this.patch('/customer-infos/:id');
  };
});