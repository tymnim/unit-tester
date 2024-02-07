// @ts-check

/**
 * tester.mjs
 *
 * This is a simple library for simple unit testing; Written by me (git blame to see)
 * when I was taking a bus for 8 hours and had no internet to add Mocha to this project.
 *
 * Usage notes:
 *
 * ~$ node tester.mjs <dirname>
 * e.g.
 *      ~$ node tester.mjs test
 * To test test folder.
 *
 * Test format:
 *
 * All tests must have must be in files with ".test." in their name e.g. "router.test.mjs"
 * All files should be in a folder provided in the node command. See <dirname> in "Usage notes"
 * The Tester will read all such files in the designated folder and run the tests automatially.
 *
 */

import fs from "fs/promises";

/**
 * @param {number} indentation
 */
function logger(indentation) {
  /** @param {string} message */
  return message => console.log("\t".repeat(indentation) + message);
}

/**
 * @param {string[]} args - command line args eg process.argv when using node
 */
export async function test(args) {
  const [_node, _path, dirpath, filePath] = args;

  const files = filePath ? [filePath] : await readDir(dirpath, /\.test\./);

  if (!files.length) {
    return;
  }

  let failures = [];

  for (let file of files) {
    try {
      const testCases = (await import(`${process.cwd()}/${file}`)).default;
      console.log("_".repeat(96));
      console.log("\x1b[36m%s\x1b[0m", `\t${file}`);
      const { failed } = await exec(testCases, file);
      failures = failures.concat(failed);
    }
    catch (e) {
      failures.push(`${file} ->`);
      failures.push(e);
    }
  }

  if (failures.length) {
    console.log("\n\x1b[31m%s\x1b[0m", "\t\t SOME TESTS FAILED =(\n");
    failures.forEach(fail => console.log("‼️  \x1b[31m%s\x1b[0m", fail));
  }
  else {
    console.log("\n\x1b[32m%s\x1b[0m", "\t\t ✅|All Tests Passed|✅");
  }
}

/**
 * @typedef {Object} Test
 * @prop {string}   name
 * @prop {function} exec
 */

/**
 * @param {Iterable.<Test>}           testCases
 * @param {string}                    scope
 * @param {number}                    depth
 * @param {function(string): void}    currentLog
 * @param {{failed: string[]}}        results
 * @returns {Promise<{failed: string[]}>}
 */
async function exec(testCases, scope, depth = 1, currentLog = logger(0), results = { failed: [] }) {
  for (let testCase of testCases) {
    const log = logger(depth);
    if (testCase instanceof Array) {
      currentLog(`🧪 ${testCase.name}`);
      await exec(testCase, scope + ` -> ${testCase.name}`, depth + 1, log, results);
      continue;
    }
    try {
      await testCase.exec();
      currentLog(`✅  -> ${testCase.name}`);
    }
    catch (e) {
      results.failed.push(scope + ` -> ${testCase.name}`);
      currentLog(`‼️   -> ${testCase.name}\n\t\t(${e?.message})`);
      if (e?.code !== "ERR_ASSERTION") {
        console.error(e);
      }
    }
  }
  return results;
}

/**
 * @param {string} path
 * @param {RegExp} pattern
 */
async function readDir(path, pattern) {
  return (await fs.readdir(path))
    .filter(file => pattern.test(file))
    .map(file => `${path}/${file}`);
}
