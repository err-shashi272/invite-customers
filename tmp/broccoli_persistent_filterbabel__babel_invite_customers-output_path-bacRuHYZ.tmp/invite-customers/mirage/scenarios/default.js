define('invite-customers/mirage/scenarios/default', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (server) {
    server.loadFixtures('customer-infos');
  };
});