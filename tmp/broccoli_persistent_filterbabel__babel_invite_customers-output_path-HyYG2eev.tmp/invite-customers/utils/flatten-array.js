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