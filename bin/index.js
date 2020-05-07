#!/usr/bin/env node
const { readAndCreate } = require('../proof/mainTranslator')

readAndCreate(process.argv[2])
