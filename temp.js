/* eslint-disable no-lonely-if */
const {
  getBody,
  getBetween,
  getEndIdxOfFunc,
  getInsideOfFunc,
  validBraces,
  getClassName,
} = require('./proof/utils/commonUtils')
const { getBeforeReturn } = require('./proof/utils/renderUtil')

let str1 = `
import react from 'react'
class TestApp extends Component {
  constructor() {
    super()
  }
  genericMethod1() {
  }
  genericMethod2() {
  }
  render() {
    const hello = [];
    const thing = this.props.thing
    return <div>{array[1]}</div>;
  }
}
export default TestApp
`
let str2 = `import statement
class    testApp extends Component {
  render() {
    return <div>{array[1]}</div>;
  }
}
export something
`
let str3 = `
import react from 'react'
class TestApp extends Component {
  render() {
    const hello = [];
    const thing = this.props.thing
    return <div>{array[1]}</div>;
  }
}
export default TestApp
`
// function translate(string) {
//   const nameOfClass = getClassName(string)
//   const propsCheck = string.includes('props') ? 'props' : ''
//   const constructorEndIdx = getEndIdxOfFunc(string, 'constructor')
//   const betweenConstructorAndRender = getBetween(string, constructorEndIdx)
//   let funcs = []
//   let pointer = 0
//   getBody(funcs, pointer, betweenConstructorAndRender)
//   const funcCheck = funcs.length ? true : false
//   const beforeReturn = getBeforeReturn(string)
//   const returnSlice = getInsideOfFunc(string, 'render')
//   let finalStr = `function ${nameOfClass}(${propsCheck}) {
//     ${funcCheck ? `\n${funcs.join('\n')}\n` : ''}
//     ${beforeReturn}
//     return (
//       ${returnSlice}
//     )
//   }`
//   return finalStr.replace(/this.props/gi, 'props')
// }
/*
expected output:
function testApp() {
  return (
    <div>hi</div>
  )
}
*/
console.log(translate(str1))
// function getClassName(string) {
//   const classIdx = string.indexOf('class')
//   const classSlice = string.slice(classIdx)
//   const nameOfClass = classSlice.split(/[ ]+/)[1]
//   return nameOfClass
// }
// function getBeforeReturn(string) {
//   let renderIdx = string.indexOf('render')
//   renderIdx = string.indexOf('{', renderIdx)
//   let middle = string
//     .slice(renderIdx + 1, string.indexOf('return', renderIdx))
//     .trim()
//   return middle
// }
// function validBraces(braces) {
//   let matches = { '(': ')', '{': '}', '[': ']' }
//   let stack = []
//   let currentChar
//   for (let i = 0; i < braces.length; i++) {
//     currentChar = braces[i]
//     if ('(){}[]'.includes(currentChar)) {
//       if (matches[currentChar]) {
//         // opening braces
//         stack.push(currentChar)
//       } else {
//         // closing braces
//         if (currentChar !== matches[stack.pop()]) {
//           return false
//         }
//       }
//     }
//   }
//   return stack.length === 0 // any unclosed braces left?
// }
// function getInsideOfFunc(string, methodStr) {
//   let startIdx = string.indexOf(methodStr)
//   startIdx = string.indexOf('{', startIdx)
//   let endIdx = startIdx + 1
//   let funcSlice = string.slice(startIdx, endIdx)
//   while (!validBraces(funcSlice)) {
//     endIdx++
//     funcSlice = string.slice(startIdx, endIdx)
//   }
//   funcSlice = funcSlice
//     .slice(funcSlice.indexOf('return') + 6, funcSlice.length - 2)
//     .trim()
//   return funcSlice
// }
// function getEndIdxOfFunc(string, methodStr) {
//   let startIdx = string.indexOf(methodStr)
//   startIdx = string.indexOf('{', startIdx)
//   let endIdx = startIdx + 1
//   let funcSlice = string.slice(startIdx, endIdx)
//   while (!validBraces(funcSlice)) {
//     endIdx++
//     funcSlice = string.slice(startIdx, endIdx)
//   }
//   return endIdx
// }
// function getBetween(string, startIdx) {
//   return string.slice(startIdx, string.indexOf('render')).trim()
// }
// function getBody(funcs, pointer, bodyStr) {
//   while (pointer < bodyStr.length) {
//     let parenIdx = bodyStr.indexOf('(', pointer)
//     let funcStartIdx = pointer
//     while (bodyStr[funcStartIdx] === ' ' || bodyStr[funcStartIdx] === '\n') {
//       funcStartIdx++
//     }
//     let funcName = bodyStr.slice(funcStartIdx, parenIdx)
//     let inside = getInsideOfFunc(bodyStr, `${funcName}`)
//     pointer = getEndIdxOfFunc(bodyStr, `${funcName}`)
//     let FuncStringified = `${funcName}() {
//       ${inside}
//     }`
//     funcs.push(FuncStringified)
//   }
// }
