import fs from "node:fs/promises";
import assert from "node:assert";
import vm from "node:vm";
import module from "node:module";

//  input: "string" relative path
//  output: (Tree of) Test | Tests
export async function readTests(file) {
  const importMap = new Map();
  const context = vm.createContext({}, { name: file });
  const link = linker(importMap, context);

  const vModule = await importModule(file, context, link);

  await vModule.evaluate() // may be unnecessary
  // https://nodejs.org/api/vm.html#modulenamespace

  return vModule.namespace.default
}

function parseImport(name) {
  // TODO: use path to make sure don't import relatevely-imported modules twice
  if (name.includes(":")) {
    return name.split(":")[1];
  }
  return name;
}

function linker(importMap, context) {
  return async function link(specifier, referencingModule, { assertions }) {
    const name = parseImport(specifier);
    let mod = importMap.get(name);
    if (!mod) {
      mod = await (module.builtinModules.includes(name) ? importNative(name, context) : importModule(name, context, link));
      importMap.set(name, mod);
    }
    return mod;
  }
}

async function importNative(specifier, context) {
  const rModule = await import(specifier)
  const sModule = new vm.SyntheticModule(Object.keys(rModule),
    function evaluateSelf () {
      // may be unnecessary if readTests does not evaluate
      Object.entries(rModule)
      .forEach(entry => this.setExport(...entry));
    }, {
      identifier: `synthetic module "${specifier}"`,
      context
    }
  )

  return sModule;
}

async function importModule(specifier, context, link) {
  const sourceText = await fs.readFile(`${process.cwd()}/${specifier}`, "utf-8");
  const vModule = new vm.SourceTextModule(sourceText, {
    identifier: `test case module for "${specifier}"`,
    context,
    initializeImportMeta(meta, module) {
      meta["isTesting"] = true;
    },
    // assuming a promise can be returned. If not... well fk
    importModuleDynamically: link
  });

  await vModule.link(link);

  return vModule;
}

