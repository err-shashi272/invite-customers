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