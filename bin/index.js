#!/usr/bin/env node
const readAndCreate = require('../lib/index.js')
const { readAndReplace } = require('../lib/cliOptions')

if (process.argv[2] === '-r') {
  for (let idx = 3; idx < process.argv.length; idx++) {
    readAndReplace(process.argv[idx])
  }
} else {
  for (let idx = 2; idx < process.argv.length; idx++) {
    readAndCreate(process.argv[idx])
  }
}
