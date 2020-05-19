/* eslint-disable max-statements */
/* eslint-disable no-path-concat */

const { handleConstructor } = require('./utils/constructorUtil')
const { readClassCompDetails } = require('./utils/translateUtils')
const { getUseEffects } = require('./utils/LifeCycleMain/lifecycleUtils')
const {
  getBody,
  replaceSetState,
  parseReactImport,
} = require('./utils/commonUtils')
const { handleRender } = require('./utils/renderUtil')

//THIS FUNCTION IS IN CHARGE OF TRANSLATING CLASS COMPONENT TO FUNCTIONAL COMPONENT && PUTS IT ALL TOGETHER
function translateToFunctionComp(fileInString) {
  // Class name and start of Component
  const classDetails = readClassCompDetails(fileInString)

  //CONSTRUCTOR
  const handledConstructor = handleConstructor(classDetails)

  //BODY
  const { body, genericMethods } = getBody(classDetails)

  //LIFE CYCLE METHODS
  const arrOfUseEffects = getUseEffects(body)

  //RENDER
  const handledRender = handleRender(classDetails)

  //MODIFICATIONS
  classDetails.beforeClass = parseReactImport(
    classDetails,
    arrOfUseEffects,
    handledConstructor
  )
  const { beforeClass, nameOfClass, propsCheck, afterClass } = classDetails

  //FINAL TEMPLATEuu
  const finalStr = `
  ${beforeClass}
  function ${nameOfClass}(${propsCheck}) {
    ${handledConstructor}
    ${`\n${arrOfUseEffects.join('\n')}\n`}
    ${`\n${genericMethods.join('\n')}\n`}
    ${handledRender}
  }
  ${afterClass}`
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
