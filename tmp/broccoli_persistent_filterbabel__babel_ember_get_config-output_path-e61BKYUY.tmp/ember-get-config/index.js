define('ember-get-config/index', ['exports', 'invite-customers/config/environment'], function (exports, _inviteCustomersConfigEnvironment) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _inviteCustomersConfigEnvironment['default'];
    }
  });
});