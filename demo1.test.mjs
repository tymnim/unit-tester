
import { Tests, Test } from "./tests.mjs";
import assert from "node:assert";

Array.prototype.lastIndexOf = function (element) {
  for (let i = this.length - 1; i >= 0; i--) {
    if (this[i] === element) return i;
  }
  return -1;
}

Array.prototype.findLastIndex = function (compare) {
  for (let i = this.length - 1; i >= 0; i--) {
    if (compare(this[i])) return i;
  }
  return -1;
}

export default [
  Tests("core",
    Tests("Array",
      Test("#lastIndexOf", () => {
        const arr = [5,2,3,2,1];
        assert.equal(arr.lastIndexOf(2), 3);
        assert.equal(arr.lastIndexOf(5), 0);
        assert.equal(arr.lastIndexOf(4), -1);
      }),
      Test("#findLastIndex", () => {
        const arr = [5,2,3,2,1];
        const euqals = number => element => element === number;
        assert.equal(arr.findLastIndex(euqals(2)), 3);
        assert.equal(arr.findLastIndex(euqals(5)), 0);
        assert.equal(arr.findLastIndex(euqals(4)), -1);
      })
    )
  )
]

