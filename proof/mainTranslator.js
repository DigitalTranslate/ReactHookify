/* eslint-disable no-path-concat */

const { str0, str1, str2, str3 } = require('./utils/exampleClass')
const { handleConstructor } = require('./utils/constructorUtil')
const fs = require('fs')
const {
  hookifyPath,
  getBodyMethods,
  getBody,
  getEndIdxOfFunc,
  getInsideOfFunc,
  getClassName,
} = require('./utils/commonUtils')
const {
  findComponents,
  createUseEffect,
  createMultipleUseEffects,
} = require('./utils/lifecycleUtils')
const { getBeforeReturn } = require('./utils/renderUtil')
const { yellow } = require('chalk')
const prettier = require('prettier')

//THIS FUNCTION IS IN CHARGE OF TRANSLATING CLASS COMPONENT TO FUNCTIONAL COMPONENT && PUTS IT ALL TOGETHER
function translateToFunctionComp(classCompInStr) {
  const nameOfClass = getClassName(classCompInStr)
  //checks whole class string from 'props'
  const propsCheck = classCompInStr.includes('props') ? 'props' : ''
  let startOfBodyIdx = classCompInStr.indexOf('{') + 1

  //CONSTRUCTOR
  const constructorCheck = /(constructor)[ ]*\(/.test(classCompInStr)
  let handledConstructor = ''

  if (constructorCheck) {
    handledConstructor = handleConstructor(classCompInStr)
    startOfBodyIdx = getEndIdxOfFunc(classCompInStr, 'constructor')
  }

  //BODY && LIFE CYCLE METHODS
  let body = getBody(classCompInStr, startOfBodyIdx)

  let funcs = []
  const lifeCyclesObj = findComponents(body)
  const numberOfKeys = Object.keys(lifeCyclesObj)
  const arrOfUseEffects = createMultipleUseEffects(lifeCyclesObj)

  getBodyMethods(funcs, body)
  numberOfKeys.forEach(() => funcs.shift())

  const lifeCycleCheck = arrOfUseEffects.length ? true : false
  const funcCheck = funcs.length ? true : false

  //RETURN STATEMENT
  const beforeReturn = getBeforeReturn(classCompInStr)
  const returnSlice = getInsideOfFunc(classCompInStr, 'render')

  //FINAL TEMPLATE
  let finalStr = `function ${nameOfClass}(${propsCheck}) {
    ${handledConstructor}
    ${lifeCycleCheck ? `\n${arrOfUseEffects.join('\n')}\n` : ''}
    ${funcCheck ? `\n${funcs.join('\n')}\n` : ''}
    ${beforeReturn}
    return (
      ${returnSlice}
    )
  }`
  return finalStr.replace(/this.props/gi, 'props').replace(/this.state/gi, '')
}

//THIS FUNCTION TAKES CREATED STRING AND WRITES A FILE
function createFunctionComponentFile(funcCompInStr, filepath) {
  const newPath = hookifyPath(filepath)
  fs.writeFile(newPath, prettier.format(funcCompInStr), (err) => {
    if (err) throw err
    console.log(yellow('Created Hookified File'))
  })
}

//THIS FUNCTION TAKES FILEPATH, READS FILE AT PATH AND THEN CREATES
//FUNCTIONAL COMPONENT EQUIVALENT
async function readAndCreate(filepath) {
  try {
    const content = await fs.promises.readFile(filepath, 'utf-8')
    //DO NOTE USE readFileSync
    const funcComponent = translateToFunctionComp(content)
    createFunctionComponentFile(funcComponent, filepath)
  } catch (error) {
    console.log('Error reading file')
  }
}

/*
TESTING
*/

//TESTING WITH READING A FILE && CAN DO WITH CLI NOW
// readAndCreate(__dirname + '/../client/app.js')

//TESTING WITHOUT READING FILE
// const finalStr = translateToFunctionComp(str0) //change which string to test
// createFunctionComponentFile(finalStr, '/client/proof.js')

module.exports = {
  readAndCreate,
}
