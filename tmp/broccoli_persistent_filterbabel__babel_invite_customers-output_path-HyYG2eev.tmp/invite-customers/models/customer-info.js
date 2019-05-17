define('invite-customers/models/customer-info', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.Model.extend({
    latitude: _emberData.default.attr('string'),
    longitude: _emberData.default.attr('string'),
    name: _emberData.default.attr('string'),
    userId: _emberData.default.attr('number'),
    distance: _emberData.default.attr('number'),
    invited: _emberData.default.attr('boolean')
  });
});