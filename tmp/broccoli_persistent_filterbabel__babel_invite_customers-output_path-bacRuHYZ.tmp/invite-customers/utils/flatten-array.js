define("invite-customers/utils/flatten-array", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = flatten;
  /* eslint no-unused-vars: "off"*/
  /* Uitility fuctions */

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