
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

import fs from "node:fs/promises";
import assert from "node:assert"
import vm from "node:vm"
import module from "node:module"

function logger(scoped) {
  return (message) => console.log("\t".repeat(scoped) + message);
}

export async function test(args) {
  const [node, path, dirpath, filePath, ...flags] = args;
  
  assert.ok( flags.includes( "--experimental-vm-modules" ) )

  const files = filePath ? [filePath] : await readDir(dirpath, /\.test\./);

  if (!files.length) {
    return;
  }

  let failures = [];

  for (let file of files) {
    try {
      const testCases = await readTests( file );
      console.log("_".repeat(96));
      console.log("\x1b[36m%s\x1b[0m", `\t${file}`);
      const { failed } = await exec(testCases, file);
      failures = failures.concat(failed);
    }
    catch(e) {
      failures.push(`${file} ->`);
      failures.push(e);
    }
  }

  if (failures.length) {
    console.log("\n\x1b[31m%s\x1b[0m", `\t\t SOME TESTS FAILED =(\n`)
    failures.forEach(fail => console.log("‼️  \x1b[31m%s\x1b[0m", fail))
  }
  else {
    console.log("\n\x1b[32m%s\x1b[0m", `\t\t ✅|All Tests Passed|✅`)
  }
}

/* input: "string" relative path
  output: (Tree of) Test | Tests
*/ async function readTests ( file ) {

  let importer = new Importer
  let vModule = importer.create_module( file )

  await vModule.link( importer.get_or_create.bind( importer ) )
  
  // await vModule.evaluate() // may be unnecessary
  // https://nodejs.org/api/vm.html#modulenamespace

  return vModule.namespace.default
}

class Importer {

  loadedModules = new Map
  
  async get_or_create ( specifier, referencingModule,{ assertions }) {
    return Importer.NATIVE_MODULES.get(specifier)
      ??
      this.loadedModules.get(specifier)
      ?? 
      await this.create_module(specifier)
  }
  
  async create_module ( specifier ) {
 
    let sourceText = await fs.readFile(`${process.cwd()}/${specifier}`)
 
    let vModule = new vm.SourceTextModule( sourceText, {
      identifier: `test case module for "${specifier}"`,
      context: Importer.CONTEXT,
      initializeImportMeta ( meta, module ) {
        meta["isTesting"] = true 
      },
      // assuming a promise can be returned. If not... well fk
      importModuleDynamically: this.get_or_create.bind( this ),
    })

    this.loadedModules.set( specifier, vModule )
  
    return vModule
  }

  static CONTEXT = vm.createContext({},{
    name: `Tests' Context`
  })
  static NATIVE_MODULES = new Map( await Promise.all( module.builtinModules().map( async specifier => {
  
    let rModule = await import(specifier)
    let sModule = new vm.SyntheticModule(
      Object.keys( rModule ), function evaluateSelf () {
      // may be unnecessary if readTests does not evaluate 
      Object.entries(rModule)
        .forEach( entry => this.setExport( ...entry ) )
    }, {
      identifier: `synthetic module "${specifier}"`,
      context: Importer.CONTEXT
    })

    return [ specifier, sModule ]
  } ) ) )
  
}

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
    catch(e) {
      results.failed.push(scope + ` -> ${testCase.name}`);
      currentLog(`‼️   -> ${testCase.name}\n\t\t(${e?.message})`);
      if (e?.code !== "ERR_ASSERTION") {
        console.error(e);
      }
    }
  }
  return results;
}

async function readDir(path, pattern) {
  return (await fs.readdir(path))
  .filter(file => pattern.test(file))
  .map(file => `${path}/${file}`);
}


