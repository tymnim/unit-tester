#!/usr/bin/env node

import { test } from "./tester.mjs";
test(process.argv)
  .then(process.exit);
