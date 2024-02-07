//@ts-check

/**
 * Usage notes:
 *  Tests("Array",
 *    Test("#lastIndexOf", () => {
 *      const arr = [5,2,3,2,1];
 *      assert.equal(arr.lastIndexOf(2), 3);
 *    })
 *  )
 */

/**
 * @typedef {Array<Test|Tests>} Tests
 * @property {string} [name]
 */

/**
 * @typedef {Object} Namable
 * @prop {string=} name
 *
 * @param   {string}  name
 * @param   {Tests & Namable}   tests
 * @returns {Tests}
 */
export function Tests(name, ...tests) {
  tests.name = name;
  return tests;
}

/**
 * @typedef {Object} Test
 * @prop {string}   name
 * @prop {function} exec
 */

/**
 * @param {string}    name
 * @param {function}  testFunction
 * @returns {Test}
 */
export function Test(name, testFunction) {
  return {
    name,
    exec: testFunction
  };
}

export default { Test, Tests };
