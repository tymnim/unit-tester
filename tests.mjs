
/**
 * Usage notes:
 *  Tests("Array",
 *    Test("#lastIndexOf", () => {
 *      const arr = [5,2,3,2,1];
 *      assert.equal(arr.lastIndexOf(2), 3);
 *    })
 *  )
 */

export function Tests(name, ...tests) {
  tests.name = name;
  return tests;
}

export function Test(name, testFunction) {
  return {
    name,
    exec: testFunction
  };
}

export default { Test, Tests };