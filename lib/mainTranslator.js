/* eslint-disable no-path-concat */

const { str0, str1, str2, str3 } = require('./utils/exampleClass')
const { handleConstructor } = require('./utils/constructorUtil')
const {
  getBodyMethods,
  getBody,
  getEndIdxOfFunc,
  getInsideOfFunc,
  getClassName,
  replaceSetState,
  getClassCompIdx,
  getClassComp,
  parseReactImport,
} = require('./utils/commonUtils')
const {
  findComponents,
  createMultipleUseEffects,
  handleAsync,
} = require('./utils/lifecycleUtils')
const { getBeforeReturn } = require('./utils/renderUtil')

//THIS FUNCTION IS IN CHARGE OF TRANSLATING CLASS COMPONENT TO FUNCTIONAL COMPONENT && PUTS IT ALL TOGETHER
function translateToFunctionComp(fileInString) {
  // Class name and start of Component
  const classCompIdx = getClassCompIdx(fileInString)
  let beforeClass = fileInString.slice(0, classCompIdx)
  const nameOfClass = getClassName(fileInString, classCompIdx)
  const classCompInString = getClassComp(fileInString, classCompIdx)
  const afterClass = fileInString.slice(classCompIdx + classCompInString.length)
  let startOfBodyIdx = classCompInString.indexOf('{') + 1

  //checks whole class string from 'props'
  const propsCheck = classCompInString.includes('props') ? 'props' : ''

  //CONSTRUCTOR
  const constructorCheck = /(constructor)[ ]*\(/.test(classCompInString)
  let handledConstructor = ''

  if (constructorCheck) {
    handledConstructor = handleConstructor(classCompInString)
    startOfBodyIdx = getEndIdxOfFunc(classCompInString, 'constructor')
  }

  //BODY && LIFE CYCLE METHODS
  let body = getBody(classCompInString, startOfBodyIdx)

  let funcs = []
  const lifeCyclesObj = findComponents(body)
  const numberOfKeys = Object.keys(lifeCyclesObj)
  const arrOfUseEffects = createMultipleUseEffects(lifeCyclesObj)
  handleAsync(arrOfUseEffects)

  getBodyMethods(funcs, body)
  numberOfKeys.forEach(() => funcs.shift())

  const lifeCycleCheck = !!arrOfUseEffects.length
  const funcCheck = !!funcs.length

  //RETURN STATEMENT
  const beforeReturn = getBeforeReturn(classCompInString)
  const returnSlice = getInsideOfFunc(classCompInString, 'render')

  //MODIFICATIONS
  beforeClass = parseReactImport(
    beforeClass,
    arrOfUseEffects,
    handledConstructor
  )

  //FINAL TEMPLATE
  let finalStr = `
  ${beforeClass}
  function ${nameOfClass}(${propsCheck}) {
    ${handledConstructor}
    ${lifeCycleCheck ? `\n${arrOfUseEffects.join('\n')}\n` : ''}
    ${funcCheck ? `\n${funcs.join('\n')}\n` : ''}
    ${beforeReturn}
    return (
      ${returnSlice}
    )
  }
  ${afterClass}`
  return replaceSetState(finalStr)
    .replace(/this.props/gi, 'props')
    .replace(/this.state./gi, '')
}

/*
TESTING
*/

//TESTING WITH READING A FILE && CAN DO WITH CLI NOW
// readAndCreate(__dirname + '/../client/app.js')

//TESTING WITHOUT READING FILE
// const finalStr = translateToFunctionComp(str0) //change which string to test
// createFunctionComponentFile(finalStr, '/client/proof.js')

module.exports = translateToFunctionComp
