const { str0, str1, str2, str3 } = require('./utils/exampleClass')
const { handleConstructor } = require('./utils/constructorUtil')
const fs = require('fs')
const {
  getBody,
  getBetween,
  getEndIdxOfFunc,
  getInsideOfFunc,
  validBraces,
  getClassName,
} = require('./utils/commonUtils')
const { getBeforeReturn } = require('./utils/renderUtil')

//THIS FUNCTION IS IN CHARGE OF TRANSLATING CLASS COMPONENT TO FUNCTIONAL COMPONENT && PUTS IT ALL TOGETHER
function translateToFunctionComp(classCompInStr) {
  const nameOfClass = getClassName(classCompInStr)
  const propsCheck = classCompInStr.includes('props') ? 'props' : ''

  const handledConstructor = handleConstructor(classCompInStr)
  const constructorEndIdx = getEndIdxOfFunc(classCompInStr, 'constructor')
  const betweenConstructorAndRender = getBetween(
    classCompInStr,
    constructorEndIdx
  )
  let funcs = []
  let pointer = 0
  getBody(funcs, pointer, betweenConstructorAndRender)

  const funcCheck = funcs.length ? true : false

  const beforeReturn = getBeforeReturn(classCompInStr)
  const returnSlice = getInsideOfFunc(classCompInStr, 'render')

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
  fs.writeFile('proof.js', funcCompInStr, (err) => {
    if (err) throw err
    console.log('Made proof.js')
  })
}

const finalStr = translateToFunctionComp(str0)
createFunctionComponentFile(finalStr)
