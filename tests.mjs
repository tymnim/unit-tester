
// I hate new keyword, so these will never be classes.
// Usage notes:

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