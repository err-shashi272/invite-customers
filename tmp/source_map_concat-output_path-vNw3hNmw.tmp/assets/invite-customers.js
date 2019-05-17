"use strict";



define('invite-customers/app', ['exports', 'ember', 'invite-customers/resolver', 'ember-load-initializers', 'invite-customers/config/environment'], function (exports, _ember, _resolver, _emberLoadInitializers, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var App = void 0;

  _ember.default.MODEL_FACTORY_INJECTIONS = true;

  App = _ember.default.Application.extend({
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix,
    Resolver: _resolver.default
  });

  (0, _emberLoadInitializers.default)(App, _environment.default.modulePrefix);

  exports.default = App;
});
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
define('invite-customers/components/fa-icon', ['exports', 'ember-font-awesome/components/fa-icon'], function (exports, _faIcon) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _faIcon.default;
    }
  });
});
define('invite-customers/components/fa-list', ['exports', 'ember-font-awesome/components/fa-list'], function (exports, _faList) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _faList.default;
    }
  });
});
define('invite-customers/components/fa-stack', ['exports', 'ember-font-awesome/components/fa-stack'], function (exports, _faStack) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _faStack.default;
    }
  });
});
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
define('invite-customers/helpers/and', ['exports', 'ember', 'ember-truth-helpers/helpers/and'], function (exports, _ember, _and) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var forExport = null;

  if (_ember.default.Helper) {
    forExport = _ember.default.Helper.helper(_and.andHelper);
  } else if (_ember.default.HTMLBars.makeBoundHelper) {
    forExport = _ember.default.HTMLBars.makeBoundHelper(_and.andHelper);
  }

  exports.default = forExport;
});
define('invite-customers/helpers/app-version', ['exports', 'ember', 'invite-customers/config/environment', 'ember-cli-app-version/utils/regexp'], function (exports, _ember, _environment, _regexp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.appVersion = appVersion;
  var version = _environment.default.APP.version;
  function appVersion(_) {
    var hash = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (hash.hideSha) {
      return version.match(_regexp.versionRegExp)[0];
    }

    if (hash.hideVersion) {
      return version.match(_regexp.shaRegExp)[0];
    }

    return version;
  }

  exports.default = _ember.default.Helper.helper(appVersion);
});
define('invite-customers/helpers/cancel-all', ['exports', 'ember', 'ember-concurrency/-helpers'], function (exports, _ember, _helpers) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.cancelHelper = cancelHelper;


  var CANCEL_REASON = "the 'cancel-all' template helper was invoked";

  function cancelHelper(args) {
    var cancelable = args[0];
    if (!cancelable || typeof cancelable.cancelAll !== 'function') {
      _ember.default.assert('The first argument passed to the `cancel-all` helper should be a Task or TaskGroup (without quotes); you passed ' + cancelable, false);
    }

    return (0, _helpers.taskHelperClosure)('cancelAll', [cancelable, CANCEL_REASON]);
  }

  exports.default = _ember.default.Helper.helper(cancelHelper);
});
define('invite-customers/helpers/eq', ['exports', 'ember', 'ember-truth-helpers/helpers/equal'], function (exports, _ember, _equal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var forExport = null;

  if (_ember.default.Helper) {
    forExport = _ember.default.Helper.helper(_equal.equalHelper);
  } else if (_ember.default.HTMLBars.makeBoundHelper) {
    forExport = _ember.default.HTMLBars.makeBoundHelper(_equal.equalHelper);
  }

  exports.default = forExport;
});
define('invite-customers/helpers/gt', ['exports', 'ember', 'ember-truth-helpers/helpers/gt'], function (exports, _ember, _gt) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var forExport = null;

  if (_ember.default.Helper) {
    forExport = _ember.default.Helper.helper(_gt.gtHelper);
  } else if (_ember.default.HTMLBars.makeBoundHelper) {
    forExport = _ember.default.HTMLBars.makeBoundHelper(_gt.gtHelper);
  }

  exports.default = forExport;
});
define('invite-customers/helpers/gte', ['exports', 'ember', 'ember-truth-helpers/helpers/gte'], function (exports, _ember, _gte) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var forExport = null;

  if (_ember.default.Helper) {
    forExport = _ember.default.Helper.helper(_gte.gteHelper);
  } else if (_ember.default.HTMLBars.makeBoundHelper) {
    forExport = _ember.default.HTMLBars.makeBoundHelper(_gte.gteHelper);
  }

  exports.default = forExport;
});
define('invite-customers/helpers/is-array', ['exports', 'ember', 'ember-truth-helpers/helpers/is-array'], function (exports, _ember, _isArray) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var forExport = null;

  if (_ember.default.Helper) {
    forExport = _ember.default.Helper.helper(_isArray.isArrayHelper);
  } else if (_ember.default.HTMLBars.makeBoundHelper) {
    forExport = _ember.default.HTMLBars.makeBoundHelper(_isArray.isArrayHelper);
  }

  exports.default = forExport;
});
define('invite-customers/helpers/is-equal', ['exports', 'ember-truth-helpers/helpers/is-equal'], function (exports, _isEqual) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _isEqual.default;
    }
  });
  Object.defineProperty(exports, 'isEqual', {
    enumerable: true,
    get: function () {
      return _isEqual.isEqual;
    }
  });
});
define('invite-customers/helpers/lt', ['exports', 'ember', 'ember-truth-helpers/helpers/lt'], function (exports, _ember, _lt) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var forExport = null;

  if (_ember.default.Helper) {
    forExport = _ember.default.Helper.helper(_lt.ltHelper);
  } else if (_ember.default.HTMLBars.makeBoundHelper) {
    forExport = _ember.default.HTMLBars.makeBoundHelper(_lt.ltHelper);
  }

  exports.default = forExport;
});
define('invite-customers/helpers/lte', ['exports', 'ember', 'ember-truth-helpers/helpers/lte'], function (exports, _ember, _lte) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var forExport = null;

  if (_ember.default.Helper) {
    forExport = _ember.default.Helper.helper(_lte.lteHelper);
  } else if (_ember.default.HTMLBars.makeBoundHelper) {
    forExport = _ember.default.HTMLBars.makeBoundHelper(_lte.lteHelper);
  }

  exports.default = forExport;
});
define('invite-customers/helpers/not-eq', ['exports', 'ember', 'ember-truth-helpers/helpers/not-equal'], function (exports, _ember, _notEqual) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var forExport = null;

  if (_ember.default.Helper) {
    forExport = _ember.default.Helper.helper(_notEqual.notEqualHelper);
  } else if (_ember.default.HTMLBars.makeBoundHelper) {
    forExport = _ember.default.HTMLBars.makeBoundHelper(_notEqual.notEqualHelper);
  }

  exports.default = forExport;
});
define('invite-customers/helpers/not', ['exports', 'ember', 'ember-truth-helpers/helpers/not'], function (exports, _ember, _not) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var forExport = null;

  if (_ember.default.Helper) {
    forExport = _ember.default.Helper.helper(_not.notHelper);
  } else if (_ember.default.HTMLBars.makeBoundHelper) {
    forExport = _ember.default.HTMLBars.makeBoundHelper(_not.notHelper);
  }

  exports.default = forExport;
});
define('invite-customers/helpers/or', ['exports', 'ember', 'ember-truth-helpers/helpers/or'], function (exports, _ember, _or) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var forExport = null;

  if (_ember.default.Helper) {
    forExport = _ember.default.Helper.helper(_or.orHelper);
  } else if (_ember.default.HTMLBars.makeBoundHelper) {
    forExport = _ember.default.HTMLBars.makeBoundHelper(_or.orHelper);
  }

  exports.default = forExport;
});
define('invite-customers/helpers/perform', ['exports', 'ember', 'ember-concurrency/-helpers'], function (exports, _ember, _helpers) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.performHelper = performHelper;
  function performHelper(args, hash) {
    return (0, _helpers.taskHelperClosure)('perform', args, hash);
  }

  exports.default = _ember.default.Helper.helper(performHelper);
});
define('invite-customers/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _pluralize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _pluralize.default;
});
define('invite-customers/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _singularize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _singularize.default;
});
define('invite-customers/helpers/task', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  function _toArray(arr) {
    return Array.isArray(arr) ? arr : Array.from(arr);
  }

  function taskHelper(_ref) {
    var _ref2 = _toArray(_ref),
        task = _ref2[0],
        args = _ref2.slice(1);

    return task._curry.apply(task, _toConsumableArray(args));
  }

  exports.default = _ember.default.Helper.helper(taskHelper);
});
define('invite-customers/helpers/xor', ['exports', 'ember', 'ember-truth-helpers/helpers/xor'], function (exports, _ember, _xor) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var forExport = null;

  if (_ember.default.Helper) {
    forExport = _ember.default.Helper.helper(_xor.xorHelper);
  } else if (_ember.default.HTMLBars.makeBoundHelper) {
    forExport = _ember.default.HTMLBars.makeBoundHelper(_xor.xorHelper);
  }

  exports.default = forExport;
});
define('invite-customers/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'invite-customers/config/environment'], function (exports, _initializerFactory, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var _config$APP = _environment.default.APP,
      name = _config$APP.name,
      version = _config$APP.version;
  exports.default = {
    name: 'App Version',
    initialize: (0, _initializerFactory.default)(name, version)
  };
});
define('invite-customers/initializers/container-debug-adapter', ['exports', 'ember-resolver/resolvers/classic/container-debug-adapter'], function (exports, _containerDebugAdapter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _containerDebugAdapter.default);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('invite-customers/initializers/data-adapter', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'data-adapter',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('invite-customers/initializers/ember-cli-mirage', ['exports', 'ember', 'ember-cli-mirage/utils/read-modules', 'invite-customers/config/environment', 'invite-customers/mirage/config', 'ember-cli-mirage/server', 'lodash/assign'], function (exports, _ember, _readModules, _environment, _config, _server, _assign2) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.startMirage = startMirage;
  var getWithDefault = _ember.default.getWithDefault;
  exports.default = {
    name: 'ember-cli-mirage',
    initialize: function initialize(application) {
      if (arguments.length > 1) {
        // Ember < 2.1
        var container = arguments[0],
            application = arguments[1];
      }

      if (_shouldUseMirage(_environment.default.environment, _environment.default['ember-cli-mirage'])) {
        startMirage(_environment.default);
      }
    }
  };
  function startMirage() {
    var env = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _environment.default;

    var environment = env.environment;
    var discoverEmberDataModels = getWithDefault(env['ember-cli-mirage'] || {}, 'discoverEmberDataModels', true);
    var modules = (0, _readModules.default)(env.modulePrefix);
    var options = (0, _assign2.default)(modules, { environment: environment, baseConfig: _config.default, testConfig: _config.testConfig, discoverEmberDataModels: discoverEmberDataModels });

    return new _server.default(options);
  }

  function _shouldUseMirage(env, addonConfig) {
    var userDeclaredEnabled = typeof addonConfig.enabled !== 'undefined';
    var defaultEnabled = _defaultEnabled(env, addonConfig);

    return userDeclaredEnabled ? addonConfig.enabled : defaultEnabled;
  }

  /*
    Returns a boolean specifying the default behavior for whether
    to initialize Mirage.
  */
  function _defaultEnabled(env, addonConfig) {
    var usingInDev = env === 'development' && !addonConfig.usingProxy;
    var usingInTest = env === 'test';

    return usingInDev || usingInTest;
  }
});
define('invite-customers/initializers/ember-concurrency', ['exports', 'ember-concurrency'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'ember-concurrency',
    initialize: function initialize() {}
  };
});
define('invite-customers/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data/index'], function (exports, _setupContainer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'ember-data',
    initialize: _setupContainer.default
  };
});
define('invite-customers/initializers/export-application-global', ['exports', 'ember', 'invite-customers/config/environment'], function (exports, _ember, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_environment.default.exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _environment.default.exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember.default.String.classify(_environment.default.modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports.default = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('invite-customers/initializers/injectStore', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'injectStore',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('invite-customers/initializers/store', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'store',
    after: 'ember-data',
    initialize: function initialize() {}
  };
});
define('invite-customers/initializers/transforms', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'transforms',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('invite-customers/initializers/truth-helpers', ['exports', 'ember', 'ember-truth-helpers/utils/register-helper', 'ember-truth-helpers/helpers/and', 'ember-truth-helpers/helpers/or', 'ember-truth-helpers/helpers/equal', 'ember-truth-helpers/helpers/not', 'ember-truth-helpers/helpers/is-array', 'ember-truth-helpers/helpers/not-equal', 'ember-truth-helpers/helpers/gt', 'ember-truth-helpers/helpers/gte', 'ember-truth-helpers/helpers/lt', 'ember-truth-helpers/helpers/lte'], function (exports, _ember, _registerHelper, _and, _or, _equal, _not, _isArray, _notEqual, _gt, _gte, _lt, _lte) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() /* container, application */{

    // Do not register helpers from Ember 1.13 onwards, starting from 1.13 they
    // will be auto-discovered.
    if (_ember.default.Helper) {
      return;
    }

    (0, _registerHelper.registerHelper)('and', _and.andHelper);
    (0, _registerHelper.registerHelper)('or', _or.orHelper);
    (0, _registerHelper.registerHelper)('eq', _equal.equalHelper);
    (0, _registerHelper.registerHelper)('not', _not.notHelper);
    (0, _registerHelper.registerHelper)('is-array', _isArray.isArrayHelper);
    (0, _registerHelper.registerHelper)('not-eq', _notEqual.notEqualHelper);
    (0, _registerHelper.registerHelper)('gt', _gt.gtHelper);
    (0, _registerHelper.registerHelper)('gte', _gte.gteHelper);
    (0, _registerHelper.registerHelper)('lt', _lt.ltHelper);
    (0, _registerHelper.registerHelper)('lte', _lte.lteHelper);
  }

  exports.default = {
    name: 'truth-helpers',
    initialize: initialize
  };
});
define("invite-customers/instance-initializers/ember-data", ["exports", "ember-data/instance-initializers/initialize-store-service"], function (exports, _initializeStoreService) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: "ember-data",
    initialize: _initializeStoreService.default
  };
});
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
define('invite-customers/mirage/fixtures/customer-infos', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = [{
    latitude: '52.986375',
    longitude: '-6.043701',
    'user-id': 12,
    name: 'Christina McArdle',
    invited: false
  }, {
    latitude: '51.92893',
    longitude: '-10.27699',
    'user-id': 1,
    name: 'Alice Cahill',
    invited: false
  }, {
    latitude: '51.8856167',
    longitude: '-10.4240951',
    'user-id': 2,
    name: 'Ian McArdle',
    invited: false
  }, {
    latitude: '52.3191841',
    longitude: '-8.5072391',
    'user-id': 3,
    name: 'Jack Enright',
    invited: false
  }, {
    latitude: '53.807778',
    longitude: '-7.714444',
    'user-id': 28,
    name: 'Charlie Halligan',
    invited: false
  }, {
    latitude: '53.4692815',
    longitude: '-9.436036',
    'user-id': 7,
    name: 'Frank Kehoe',
    invited: false
  }, {
    latitude: '54.0894797',
    longitude: '-6.18671',
    'user-id': 8,
    name: 'Eoin Ahearn',
    invited: false
  }, {
    latitude: '53.038056',
    longitude: '-7.653889',
    'user-id': 26,
    name: 'Stephen McArdle',
    invited: false
  }, {
    latitude: '54.1225',
    longitude: '-8.143333',
    'user-id': 27,
    name: 'Enid Gallagher',
    invited: false
  }, {
    latitude: '53.1229599',
    longitude: '-6.2705202',
    'user-id': 6,
    name: 'Theresa Enright',
    invited: true
  }, {
    latitude: '52.2559432',
    longitude: '-7.1048927',
    'user-id': 9,
    name: 'Jack Dempsey',
    invited: false
  }, {
    latitude: '52.240382',
    longitude: '-6.972413',
    'user-id': 10,
    name: 'Georgina Gallagher',
    invited: false
  }, {
    latitude: '53.2451022',
    longitude: '-6.238335',
    'user-id': 4,
    name: 'Ian Kehoe',
    invited: false
  }, {
    latitude: '53.1302756',
    longitude: '-6.2397222',
    'user-id': 5,
    name: 'Nora Dempsey',
    invited: true
  }, {
    latitude: '53.008769',
    longitude: '-6.1056711',
    'user-id': 11,
    name: 'Richard Finnegan',
    invited: true
  }, {
    latitude: '53.1489345',
    longitude: '-6.8422408',
    'user-id': 31,
    name: 'Alan Behan',
    invited: false
  }, {
    latitude: '53',
    longitude: '-7',
    'user-id': 13,
    name: 'Olive Ahearn',
    invited: false
  }, {
    latitude: '51.999447',
    longitude: '-9.742744',
    'user-id': 14,
    name: 'Helen Cahill',
    invited: false
  }, {
    latitude: '52.966',
    longitude: '-6.463',
    'user-id': 15,
    name: 'Michael Ahearn',
    invited: false
  }, {
    latitude: '52.366037',
    longitude: '-8.179118',
    'user-id': 16,
    name: 'Ian Larkin',
    invited: false
  }, {
    latitude: '54.180238',
    longitude: '-5.920898',
    'user-id': 17,
    name: 'Patricia Cahill',
    invited: false
  }, {
    latitude: '53.0033946',
    longitude: '-6.3877505',
    'user-id': 39,
    name: 'Lisa Ahearn',
    invited: false
  }, {
    latitude: '52.228056',
    longitude: '-7.915833',
    'user-id': 18,
    name: 'Bob Larkin',
    invited: false
  }, {
    latitude: '54.133333',
    longitude: '-6.433333',
    'user-id': 24,
    name: 'Rose Enright',
    invited: false
  }, {
    latitude: '55.033',
    longitude: '-8.112',
    'user-id': 19,
    name: 'Enid Cahill',
    invited: false
  }, {
    latitude: '53.521111',
    longitude: '-9.831111',
    'user-id': 20,
    name: 'Enid Enright',
    invited: false
  }, {
    latitude: '51.802',
    longitude: '-9.442',
    'user-id': 21,
    name: 'David Ahearn',
    invited: false
  }, {
    latitude: '54.374208',
    longitude: '-8.371639',
    'user-id': 22,
    name: 'Charlie McArdle',
    invited: false
  }, {
    latitude: '53.74452',
    longitude: '-7.11167',
    'user-id': 29,
    name: 'Oliver Ahearn',
    invited: false
  }, {
    latitude: '53.761389',
    longitude: '-7.2875',
    'user-id': 30,
    name: 'Nick Enright',
    invited: false
  }, {
    latitude: '54.080556',
    longitude: '-6.361944',
    'user-id': 23,
    name: 'Eoin Gallagher',
    invited: false
  }, {
    latitude: '52.833502',
    longitude: '-8.522366',
    'user-id': 25,
    name: 'David Behan',
    invited: false
  }];
});
define('invite-customers/mirage/scenarios/default', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (server) {
    server.loadFixtures('customer-infos');
  };
});
define('invite-customers/mirage/serializers/application', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.JSONAPISerializer.extend({});
});
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
define('invite-customers/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberResolver.default;
});
define('invite-customers/router', ['exports', 'ember', 'invite-customers/config/environment'], function (exports, _ember, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var Router = _ember.default.Router.extend({
    location: _environment.default.locationType,
    rootURL: _environment.default.rootURL
  });

  Router.map(function () {
    this.route('customers', { path: '/' });
  });

  exports.default = Router;
});
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
define('invite-customers/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _ajax) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _ajax.default;
    }
  });
});
define("invite-customers/templates/application", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "K+DerKBB", "block": "{\"statements\":[[1,[26,[\"outlet\"]],false],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "invite-customers/templates/application.hbs" } });
});
define("invite-customers/templates/components/customer-info", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "n0NAroT4", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"card-block\"],[13],[0,\"\\n  \"],[11,\"blockquote\",[]],[15,\"class\",\"card-blockquote\"],[13],[0,\"\\n    \"],[11,\"h4\",[]],[13],[1,[28,[\"customer\",\"name\"]],false],[0,\" (\"],[1,[28,[\"customer\",\"userId\"]],false],[0,\")\"],[14],[0,\"\\n    \"],[11,\"p\",[]],[13],[0,\"\\n      Latitude: \"],[1,[28,[\"customer\",\"latitude\"]],false],[11,\"br\",[]],[13],[14],[0,\"\\n      Longitude: \"],[1,[28,[\"customer\",\"longitude\"]],false],[11,\"br\",[]],[13],[14],[0,\"\\n      Distance from office: \"],[11,\"span\",[]],[16,\"class\",[34,[\"distance \",[33,[\"if\"],[[28,[\"isOutOfReach\"]],\"text-danger\"],null]]]],[13],[1,[26,[\"distanceFromOffice\"]],false],[0,\"km\"],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"footer\",[]],[13],[0,\"\\n\"],[6,[\"if\"],[[28,[\"isOutOfReach\"]]],null,{\"statements\":[[0,\"        \"],[11,\"div\",[]],[15,\"class\",\"alert alert-danger\"],[15,\"role\",\"alert\"],[13],[0,\"\\n          \"],[11,\"strong\",[]],[13],[0,\"Oh snap!\"],[14],[0,\" this customer is out of reach.\\n        \"],[14],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[6,[\"if\"],[[33,[\"and\"],[[28,[\"customer\",\"invited\"]],[33,[\"not\"],[[28,[\"inviteCustomerTask\",\"isRunning\"]]],null]],null]],null,{\"statements\":[[0,\"          \"],[11,\"button\",[]],[15,\"class\",\"btn btn-outline-success disabled\"],[15,\"disabled\",\"\"],[13],[0,\"\\n            Invited\\n            \"],[11,\"span\",[]],[15,\"class\",\"fa fa-check\"],[15,\"aria-hidden\",\"true\"],[13],[14],[0,\"\\n          \"],[14],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[0,\"          \"],[11,\"button\",[]],[15,\"class\",\"btn btn-success\"],[16,\"onclick\",[33,[\"perform\"],[[28,[\"inviteCustomerTask\"]]],null],null],[13],[0,\"\\n            \"],[1,[33,[\"if\"],[[28,[\"inviteCustomerTask\",\"isRunning\"]],\"Inviting...\",\"Invite\"],null],false],[0,\"\\n          \"],[14],[0,\"\\n\"]],\"locals\":[]}]],\"locals\":[]}],[0,\"    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "invite-customers/templates/components/customer-info.hbs" } });
});
define("invite-customers/templates/customers", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "r74TG76k", "block": "{\"statements\":[[11,\"div\",[]],[15,\"id\",\"customers-list\"],[15,\"class\",\"container\"],[13],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"btn-group action-buttons\"],[15,\"role\",\"group\"],[15,\"aria-label\",\"Basic example\"],[13],[0,\"\\n    \"],[11,\"button\",[]],[15,\"class\",\"btn btn-outline-primary\"],[5,[\"action\"],[[28,[null]],\"toggleParams\",\"withinRange\"]],[13],[1,[33,[\"if\"],[[28,[\"withinRange\"]],\"See all customers\",\"Filter within range only\"],null],false],[14],[0,\"\\n    \"],[11,\"button\",[]],[15,\"class\",\"btn btn-outline-primary\"],[5,[\"action\"],[[28,[null]],\"sortInfos\"]],[13],[0,\"Sort by \"],[1,[33,[\"if\"],[[33,[\"eq\"],[[28,[\"sort\"]],\"userId\"],null],\"distance\",\"user-id\"],null],false],[14],[0,\"\\n  \"],[14],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"row\"],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"sortedInfos\"]]],null,{\"statements\":[[0,\"      \"],[1,[33,[\"customer-info\"],null,[[\"customer\"],[[28,[\"customer\"]]]]],false],[0,\"\\n\"]],\"locals\":[\"customer\"]},null],[0,\"  \"],[14],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "invite-customers/templates/customers.hbs" } });
});
define('invite-customers/tests/mirage/mirage.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | mirage');

  QUnit.test('mirage/config.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/config.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/fixtures/customer-infos.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/fixtures/customer-infos.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/scenarios/default.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/scenarios/default.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/serializers/application.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/serializers/application.js should pass ESLint\n\n');
  });
});
define("invite-customers/utils/calculate-distance", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = calculateDistance;
  function calculateDistance(lat1, lon1, lat2, lon2) {
    var radlat1 = Math.PI * lat1 / 180;
    var radlat2 = Math.PI * lat2 / 180;
    var theta = lon1 - lon2;
    var radtheta = Math.PI * theta / 180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    return dist * 60 * 1.1515 * 1.609344;
  }
});
define("invite-customers/utils/flatten-array", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = flatten;
  /* eslint no-unused-vars: "off"*/

  /* Task:
    Write a function that will flatten an array of arbitrarily nested arrays of integers into a flat array of integers.
    e.g. [[1,2,[3]],4] → [1,2,3,4]. If the language you're using has a function to flatten arrays, you should pretend it doesn't exist.
  
    You can use the code below to test it:
    let array = [1,2,3, ['A', 'B'], 4, 5, ['C', 'D', ['1E', '2E']]];
    flatten1(array); // [1, 2, 3, "A", "B", 4, 5, "C", "D", "1E", "2E"]
    flatten2(array); // [1, 2, 3, "A", "B", 4, 5, "C", "D", "1E", "2E"]
  */

  // Solution 1
  var flatten1 = function flatten1(array) {
    var flatArray = [];
    var flattenArray = function flattenArray(array) {
      array.forEach(function (element) {
        if (Array.isArray(element)) {
          flattenArray(element);
        } else {
          flatArray.push(element);
        }
      });
    };
    flattenArray(array);
    return flatArray;
  };

  // Solution 2
  var flatten2 = function flatten2(array) {
    return array.reduce(function (a, b) {
      if (Array.isArray(b)) {
        return [].concat(a, flatten(b));
      }
      return [].concat(a, b);
    });
  };

  // solution 2 as one-liner
  function flatten(ary) {
    return ary.reduce(function (a, b) {
      return [].concat(a, Array.isArray(b) ? flatten(b) : b);
    });
  }
});


define('invite-customers/config/environment', ['ember'], function(Ember) {
  var prefix = 'invite-customers';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

if (!runningTests) {
  require("invite-customers/app")["default"].create({"name":"invite-customers","version":"0.0.0+"});
}
//# sourceMappingURL=invite-customers.map
