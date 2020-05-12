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
} = require('./utils/commonUtils')
const {
  findComponents,
  createMultipleUseEffects,
} = require('./utils/lifecycleUtils')
const { getBeforeReturn } = require('./utils/renderUtil')

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

  const lifeCycleCheck = !!arrOfUseEffects.length
  const funcCheck = !!funcs.length

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

  return replaceSetState(finalStr)
    .replace(/this.props/gi, 'props')
    .replace(/this.state./gi, '')
}

//THIS FUNCTION TAKES CREATED STRING AND WRITES A FILE
// function createFunctionComponentFile(funcCompInStr, filepath) {
//   const newPath = hookifyPath(filepath)
//   fs.writeFile(
//     newPath,
//     prettier.format(funcCompInStr, { semi: false, parser: 'babel' }),
//     (err) => {
//       if (err) throw err
//       console.log(yellow('Created Hookified File'))
//     }
//   )
// }

//THIS FUNCTION TAKES FILEPATH, READS FILE AT PATH AND THEN CREATES
//FUNCTIONAL COMPONENT EQUIVALENT
// async function readAndCreate(filepath) {
//   try {
//     // const content = await fs.promises.readFile(filepath, 'utf-8')
//     const unformattedContent = await fs.promises.readFile(filepath, 'utf-8')

//     //DO NOTE USE readFileSync
//     const content = prettier.format(unformattedContent, {
//       semi: false,
//       parser: 'babel',
//     })
//     const funcComponent = translateToFunctionComp(content)
//     createFunctionComponentFile(funcComponent, filepath)
//   } catch (error) {
//     console.error(error)
//   }
// }

/*
TESTING
*/

//TESTING WITH READING A FILE && CAN DO WITH CLI NOW
// readAndCreate(__dirname + '/../client/app.js')

//TESTING WITHOUT READING FILE
// const finalStr = translateToFunctionComp(str0) //change which string to test
// createFunctionComponentFile(finalStr, '/client/proof.js')

module.exports = translateToFunctionComp
