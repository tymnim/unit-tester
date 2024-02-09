// @ts-check
import assert from "node:assert";

/**
 * @param {any[]} array
 * @param {any}   element
 */
function lastIndexOf(array, element) {
  for (let i = array.length - 1; i >= 0; i--) {
    if (array[i] === element) return i;
  }
  return -1;
}

/**
 * @param {any[]}                   array
 * @param {function(any): boolean}  compare
 */
function findLastIndex(array, compare) {
  for (let i = array.length - 1; i >= 0; i--) {
    if (compare(array[i])) return i;
  }
  return -1;
}

export default {
  "core": {
    "Array": {
      "#lastIndexOf": () => {
        const arr = [5, 2, 3, 2, 1];
        assert.equal(lastIndexOf(arr, 2), 3);
        assert.equal(lastIndexOf(arr, 5), 0);
        assert.equal(lastIndexOf(arr, 4), -1);
      },
      "#findLastIndex": () => {
        const arr = [5, 2, 3, 2, 1];
        const euqals = number => element => element === number;
        assert.equal(findLastIndex(arr, euqals(2)), 3);
        assert.equal(findLastIndex(arr, euqals(5)), 0);
        assert.equal(findLastIndex(arr, euqals(4)), -1);
      }
    }
  }
};

