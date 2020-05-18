#!/usr/bin/env node
const readAndCreate = require('../lib/index.js')

for (let idx = 2; idx < process.argv.length; idx++) {
  readAndCreate(process.argv[idx])
}
