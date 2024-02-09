# unit-tester
A simple framework for simple unit tests

# Premise

This is a simple library for very simple and limited unit testing.

I had to write it I was taking a bus for 6 hours and had no internet to add Mocha to a project.

#### Output example:

```
☁  unit-tester [master] ⚡  ./test.mjs ./
________________________________________________________________________________________________
	.//demo.test.mjs
🧪 core
	🧪 Array
		✅  -> #lastIndexOf
		✅  -> #findLastIndex

		 ✅|All Tests Passed|✅
```

# Installation
```
~$ npm i unit-tester --save-dev
```

# Usage Notes

```
~$ mkdir tests
~$ touch tests/something.test.mjs
~$ edit tests/something.test.mjs
```

```js
import assert from "node:assert"
import { Tests, Test } from "unit-tester"
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
}
```

```
~$ node_modules/u-tester/test.mjs test
```

#### Pro tip:

Add this command `"test": "node_modules/u-tester/test.mjs test"` to `"scripts"` section in your `package.json`.

Now you can use `~$ npm test` to test. Also you can replace the `test` folder with whatever folder name suits you best.


## Managing and writing tests

All tests must be in files with `.test.` in their name e.g. `router.test.mjs`

All files should be in a folder provided in the command e.g. `node_modules/u-tester/test.mjs test`

The Tester will read all such files in the designated folder and run the tests automatically.

The `.test.` files should export default a test tree.

Test functions can be `async` if needed.
