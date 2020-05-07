/* eslint-disable no-path-concat */
const { str0, str1, str2, str3 } = require('./utils/exampleClass')
const { handleConstructor } = require('./utils/constructorUtil')
const { getBeforeReturn } = require('./utils/renderUtil')
const fs = require('fs')
const {
  getBody,
  getBetween,
  getEndIdxOfFunc,
  getInsideOfFunc,
  getClassName,
} = require('./utils/commonUtils')

//THIS FUNCTION IS IN CHARGE OF TRANSLATING CLASS COMPONENT TO FUNCTIONAL COMPONENT && PUTS IT ALL TOGETHER
function translateToFunctionComp(classCompInStr) {
  const nameOfClass = getClassName(classCompInStr)
  //checks whole class string from 'props'
  const propsCheck = classCompInStr.includes('props') ? 'props' : ''

  //CONSTRUCTOR
  const handledConstructor = handleConstructor(classCompInStr)

  //BODY
  const constructorEndIdx = getEndIdxOfFunc(classCompInStr, 'constructor')
  const betweenConstructorAndRender = getBetween(
    classCompInStr,
    constructorEndIdx
  )
  let funcs = []
  let pointer = 0
  getBody(funcs, pointer, betweenConstructorAndRender)
  const funcCheck = funcs.length ? true : false

  //RENDER
  const beforeReturn = getBeforeReturn(classCompInStr)
  const returnSlice = getInsideOfFunc(classCompInStr, 'render')

  //FINAL TEMPLATE
  let finalStr = `function ${nameOfClass}(${propsCheck}) {
    ${handledConstructor}
    ${funcCheck ? `\n${funcs.join('\n')}\n` : ''}
    ${beforeReturn}
    return (
      ${returnSlice}
    )
  }`
  return finalStr.replace(/this.props/gi, 'props')
}

//THIS FUNCTION TAKES CREATED STRING AND WRITES A FILE
function createFunctionComponentFile(funcCompInStr) {
  fs.writeFile(
    __dirname + '/../proof/proof.js', //this will be modified later on to handle the file's name and relative path
    funcCompInStr,
    (err, contents) => {
      //creates proof.js in proof directory
      if (err) throw err
      console.log('Made proof.js')
    }
  )
}

//THIS FUNCTION TAKES FILEPATH, READS FILE AT PATH AND THEN CREATES
//FUNCTIONAL COMPONENT EQUIVALENT
async function readAndCreate(filepath) {
  const content = await fs.promises.readFile(filepath, 'utf-8')
  //DO NOTE USE readFileSync
  const funcComponent = translateToFunctionComp(content)
  createFunctionComponentFile(funcComponent)
}

//TESTING WITH READING A FILE
readAndCreate(__dirname + '/../client/app.js')

//TESTING WITHOUT READING FILE
const finalStr = translateToFunctionComp(str0) //change which string to test
createFunctionComponentFile(finalStr)
