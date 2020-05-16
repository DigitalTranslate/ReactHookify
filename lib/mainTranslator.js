/* eslint-disable max-statements */
/* eslint-disable no-path-concat */

const { handleConstructor } = require('./utils/constructorUtil')
const { iterator } = require('./utils/LifeCycleMain/groupUseEffects')
const { readClassCompDetails } = require('./utils/translateUtils')
const {
  createUseEffects,
  findComponents,
  handleAsync,
  getUseEffects,
} = require('./utils/LifeCycleMain/lifecycleUtils')
const {
  addAsyncTag,
  getBodyMethods,
  getBody,
  getEndIdxOfFunc,
  getInsideOfFunc,
  // getClassName,
  replaceSetState,
  // getClassCompIdx,
  // getClassComp,
  parseReactImport,
  removeLifecycles,
} = require('./utils/commonUtils')
const { getBeforeReturn } = require('./utils/renderUtil')

//THIS FUNCTION IS IN CHARGE OF TRANSLATING CLASS COMPONENT TO FUNCTIONAL COMPONENT && PUTS IT ALL TOGETHER
function translateToFunctionComp(fileInString) {
  // Class name and start of Component
  const classDetails = readClassCompDetails(fileInString)

  //CONSTRUCTOR
  const handledConstructor = handleConstructor(classDetails)

  //BODY
  const allMethods = []
  const body = getBody(classDetails, allMethods)

  //LIFE CYCLE METHODS
  const arrOfUseEffects = getUseEffects(body)

  // lifecycles are handled separately, so remove them from allMethods (which includes methods)
  const genericMethods = removeLifecycles(allMethods)
  addAsyncTag(genericMethods)

  const lifeCycleCheck = !!arrOfUseEffects.length
  const funcCheck = !!genericMethods.length

  //RETURN STATEMENT
  const beforeReturn = getBeforeReturn(classDetails.classCompInString)
  const returnSlice = getInsideOfFunc(classDetails.classCompInString, 'render')

  //MODIFICATIONS
  classDetails.beforeClass = parseReactImport(
    classDetails.beforeClass,
    arrOfUseEffects,
    handledConstructor
  )

  //FINAL TEMPLATE
  let finalStr = `
  ${classDetails.beforeClass}
  function ${classDetails.nameOfClass}(${classDetails.propsCheck}) {
    ${handledConstructor}
    ${lifeCycleCheck ? `\n${arrOfUseEffects.join('\n')}\n` : ''}
    ${funcCheck ? `\n${genericMethods.join('\n')}\n` : ''}
    ${beforeReturn}
    return (
      ${returnSlice}
    )
  }
  ${classDetails.afterClass}`
  return replaceSetState(finalStr)
    .replace(/this\.props/gi, 'props')
    .replace(/this\.state\./gi, '')
    .replace(/this\./gi, '')
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
