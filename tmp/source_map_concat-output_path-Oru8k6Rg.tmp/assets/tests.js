'use strict';

define('invite-customers/tests/acceptance/customers-test', ['qunit', 'invite-customers/tests/helpers/module-for-acceptance'], function (_qunit, _moduleForAcceptance) {
  'use strict';

  (0, _moduleForAcceptance.default)('Acceptance | Customers');

  (0, _qunit.test)('visiting /customers', function (assert) {
    visit('/');

    andThen(function () {
      var correctOrderedIds = '4,5,6,8,11,12,13,15,17,23,24,26,29,30,31,39';
      var ids = [];
      find('.min-300.card h4').map(function (_, element) {
        ids.push(element.textContent.replace(/\D+/g, ''));
      });
      assert.equal(currentURL(), '/');
      assert.equal(find('.min-300.card').length, 16, 'Correct number of customers rendered (16)');
      assert.equal(find('.action-buttons .btn-outline-primary').length, 2, '2 action buttons rendered');
      assert.equal(find('.btn.btn-success').length, 13, '13 not invited buttons rendered');
      assert.equal(find('.btn.btn-outline-success').length, 3, '3 invited buttons rendered');
      assert.equal(ids.join(','), correctOrderedIds, 'Correctly ordered (by User-ID)');

      click('.action-buttons .btn-outline-primary:eq(1)');
    });

    andThen(function () {
      var correctOrderedDIstances = '1055,2327,2407,3812,3834,4175,4371,4428,6222,7221,8265,8271,8354,8904,9609,9886';
      var distances = [];
      find('.min-300.card .distance').map(function (_, element) {
        distances.push(element.textContent.replace(/\D+/g, ''));
      });

      assert.equal(distances.join(','), correctOrderedDIstances, 'Correctly ordered (by distance)');
      click('.action-buttons .btn-outline-primary:eq(0)');
    });

    andThen(function () {
      assert.equal(find('.min-300.card').length, 32, 'Correct number of customers rendered (32)');
    });
  });
});
define('invite-customers/tests/app.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | app');

  QUnit.test('app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass ESLint\n\n');
  });

  QUnit.test('components/customer-info.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/customer-info.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/customers.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/customers.js should pass ESLint\n\n');
  });

  QUnit.test('models/customer-info.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/customer-info.js should pass ESLint\n\n');
  });

  QUnit.test('resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass ESLint\n\n');
  });

  QUnit.test('router.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass ESLint\n\n');
  });

  QUnit.test('routes/customers.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/customers.js should pass ESLint\n\n');
  });

  QUnit.test('utils/calculate-distance.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'utils/calculate-distance.js should pass ESLint\n\n');
  });

  QUnit.test('utils/flatten-array.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'utils/flatten-array.js should pass ESLint\n\n');
  });
});
define('invite-customers/tests/helpers/destroy-app', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = destroyApp;
  function destroyApp(application) {
    _ember.default.run(application, 'destroy');
    if (window.server) {
      window.server.shutdown();
    }
  }
});
define('invite-customers/tests/helpers/module-for-acceptance', ['exports', 'qunit', 'ember', 'invite-customers/tests/helpers/start-app', 'invite-customers/tests/helpers/destroy-app'], function (exports, _qunit, _ember, _startApp, _destroyApp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (name) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    (0, _qunit.module)(name, {
      beforeEach: function beforeEach() {
        this.application = (0, _startApp.default)();

        if (options.beforeEach) {
          return options.beforeEach.apply(this, arguments);
        }
      },
      afterEach: function afterEach() {
        var _this = this;

        var afterEach = options.afterEach && options.afterEach.apply(this, arguments);
        return Promise.resolve(afterEach).then(function () {
          return (0, _destroyApp.default)(_this.application);
        });
      }
    });
  };

  var Promise = _ember.default.RSVP.Promise;
});
define('invite-customers/tests/helpers/resolver', ['exports', 'invite-customers/resolver', 'invite-customers/config/environment'], function (exports, _resolver, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var resolver = _resolver.default.create();

  resolver.namespace = {
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix
  };

  exports.default = resolver;
});
define('invite-customers/tests/helpers/start-app', ['exports', 'ember', 'invite-customers/app', 'invite-customers/config/environment'], function (exports, _ember, _app, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = startApp;
  function startApp(attrs) {
    var attributes = _ember.default.merge({}, _environment.default.APP);
    attributes = _ember.default.merge(attributes, attrs); // use defaults, but you can override;

    return _ember.default.run(function () {
      var application = _app.default.create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
      return application;
    });
  }
});
define('invite-customers/tests/integration/components/customer-info-test', ['ember', 'ember-qunit', 'invite-customers/utils/calculate-distance'], function (_ember, _emberQunit, _calculateDistance) {
  'use strict';

  var officeCoordinates = { lat: '53.3393', lon: '-6.2576841' };

  (0, _emberQunit.moduleForComponent)('customer-info', 'Integration | Component | Customer Info', {
    integration: true
  });

  (0, _emberQunit.test)('it renders customer-info box within range withouth being invited', function (assert) {
    var customer = _ember.default.Object.create({
      latitude: '52.986375',
      longitude: '-6.043701',
      userId: 12,
      name: 'Christina McArdle',
      invited: false
    });

    var distance = (0, _calculateDistance.default)(officeCoordinates.lat, officeCoordinates.lon, customer.latitude, customer.longitude).toFixed(2);

    this.set('customer', customer);
    this.render(_ember.default.HTMLBars.template({
      "id": "/gG+l2sX",
      "block": "{\"statements\":[[1,[33,[\"customer-info\"],null,[[\"customer\"],[[28,[\"customer\"]]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.notOk(this.$('.min-300.card').hasClass('is-out-of-reach'), 'The card does not have the `is-out-of-reach` class');
    assert.equal(this.$('.card-blockquote h4').text().trim(), customer.name + ' (' + customer.userId + ')', 'Correct costumer name rendered');
    assert.ok(this.$('.card-blockquote p').text().trim().includes('Latitude: ' + customer.latitude), 'Correct latitude rendered');
    assert.ok(this.$('.card-blockquote p').text().trim().includes('Longitude: ' + customer.longitude), 'Correct longitude rendered');
    assert.ok(this.$('.card-blockquote p').text().trim().includes('Distance from office: ' + distance + 'km'), 'Correct distance rendered');
    assert.ok(this.$('.btn-success').length, 'Invite button rendered');
    this.$('.btn-success').click();
    assert.equal(this.$('.btn-outline-success').attr('disabled'), 'disabled', 'disabled `Invite` button rendered');
  });

  (0, _emberQunit.test)('it renders customer-info box out of range', function (assert) {
    var customer = _ember.default.Object.create({
      latitude: '51.92893',
      longitude: '-10.27699',
      userId: 1,
      name: 'Alice Cahill',
      invited: false
    });

    var distance = (0, _calculateDistance.default)(officeCoordinates.lat, officeCoordinates.lon, customer.latitude, customer.longitude).toFixed(2);

    this.set('customer', customer);
    this.render(_ember.default.HTMLBars.template({
      "id": "/gG+l2sX",
      "block": "{\"statements\":[[1,[33,[\"customer-info\"],null,[[\"customer\"],[[28,[\"customer\"]]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.ok(this.$('.min-300.card').hasClass('is-out-of-reach'), 'The card has the `is-out-of-reach-class`');
    assert.equal(this.$('.card-blockquote h4').text().trim(), customer.name + ' (' + customer.userId + ')', 'Correct costumer name rendered');
    assert.ok(this.$('.card-blockquote p').text().trim().includes('Latitude: ' + customer.latitude), 'Correct latitude rendered');
    assert.ok(this.$('.card-blockquote p').text().trim().includes('Longitude: ' + customer.longitude), 'Correct longitude rendered');
    assert.ok(this.$('.card-blockquote p').text().trim().includes('Distance from office: ' + distance + 'km'), 'Correct distance rendered');
    assert.equal(this.$('.alert-danger')[0].textContent.trim(), 'Oh snap! this customer is out of reach.', 'Correct text in `alert-danger` rendered');
  });
});
define('invite-customers/tests/test-helper', ['invite-customers/tests/helpers/resolver', 'ember-qunit', 'ember-cli-qunit'], function (_resolver, _emberQunit, _emberCliQunit) {
  'use strict';

  (0, _emberQunit.setResolver)(_resolver.default);
  (0, _emberCliQunit.start)();
});
define('invite-customers/tests/tests.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | tests');

  QUnit.test('acceptance/customers-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/customers-test.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/destroy-app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/destroy-app.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/module-for-acceptance.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/module-for-acceptance.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/resolver.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/start-app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/start-app.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/customer-info-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/customer-info-test.js should pass ESLint\n\n');
  });

  QUnit.test('test-helper.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass ESLint\n\n');
  });

  QUnit.test('unit/models/customer-info-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/customer-info-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/customers-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/customers-test.js should pass ESLint\n\n');
  });
});
define('invite-customers/tests/unit/models/customer-info-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForModel)('customer-info', 'Unit | Model | Customer Info');

  (0, _emberQunit.test)('it exists', function (assert) {
    var customerInfo = {
      latitude: '52.986375',
      longitude: '-6.043701',
      userId: 12,
      name: 'Christina McArdle',
      invited: false
    };

    var model = this.subject(customerInfo);

    assert.equal(model.get('latitude'), customerInfo.latitude, 'latitude successfully saved');
    assert.equal(model.get('longitude'), customerInfo.longitude, 'longitude successfully saved');
    assert.equal(model.get('userId'), customerInfo.userId, 'userId successfully saved');
    assert.equal(model.get('name'), customerInfo.name, 'userId successfully saved');
    assert.equal(model.get('invited'), customerInfo.invited, 'userId successfully saved');
  });
});
define('invite-customers/tests/unit/routes/customers-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:customers', 'Unit | Route | Customers');

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
require('invite-customers/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests.map
