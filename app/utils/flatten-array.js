/* eslint no-unused-vars: "off"*/
/* Uitility fuctions */

// Solution 1
let flatten1 = (array) => {
  let flatArray = [];
  let flattenArray = (array) => {
    array.forEach(element => {
      if (Array.isArray(element)) {
        flattenArray(element);
      } else {
        flatArray.push(element);
      }
    });
  }
  flattenArray(array);
  return flatArray;
};

// Solution 2
let flatten2 = (array) => {
  return array.reduce((a, b) => {
    if (Array.isArray(b)) {
      return [].concat(a, flatten(b));
    }
    return [].concat(a, b);
  })
}

// solution 2 as one-liner
export default function flatten(ary) {
  return ary.reduce((a, b) => [].concat(a, Array.isArray(b) ? flatten(b) : b));
}
