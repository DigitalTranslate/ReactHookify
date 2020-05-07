/* eslint-disable no-lonely-if */
function getClassName(string) {
  const classIdx = string.indexOf('class')
  const classSlice = string.slice(classIdx)
  const nameOfClass = classSlice.split(/[ ]+/)[1]
  return nameOfClass
}

function validBraces(braces) {
  let matches = { '(': ')', '{': '}', '[': ']' }
  let stack = []
  let currentChar
  for (let i = 0; i < braces.length; i++) {
    currentChar = braces[i]
    if ('(){}[]'.includes(currentChar)) {
      if (matches[currentChar]) {
        // opening braces
        stack.push(currentChar)
      } else {
        // closing braces
        if (currentChar !== matches[stack.pop()]) {
          return false
        }
      }
    }
  }
  return stack.length === 0 // any unclosed braces left?
}
function getInsideOfFunc(string, methodStr) {
  let startIdx = string.indexOf(methodStr)
  startIdx = string.indexOf('{', startIdx)
  let endIdx = startIdx + 1
  let funcSlice = string.slice(startIdx, endIdx)
  while (!validBraces(funcSlice)) {
    endIdx++
    funcSlice = string.slice(startIdx, endIdx)
  }
  funcSlice = funcSlice
    .slice(funcSlice.indexOf('return') + 6, funcSlice.length - 2)
    .trim()
  return funcSlice
}
function getEndIdxOfFunc(string, methodStr) {
  let startIdx = string.indexOf(methodStr)
  startIdx = string.indexOf('{', startIdx)
  let endIdx = startIdx + 1
  let funcSlice = string.slice(startIdx, endIdx)
  while (!validBraces(funcSlice)) {
    endIdx++
    funcSlice = string.slice(startIdx, endIdx)
  }
  return endIdx
}
function getBetween(string, startIdx) {
  return string.slice(startIdx, string.indexOf('render')).trim()
}
function getBody(funcs, pointer, bodyStr) {
  while (pointer < bodyStr.length) {
    let parenIdx = bodyStr.indexOf('(', pointer)
    let funcStartIdx = pointer
    while (bodyStr[funcStartIdx] === ' ' || bodyStr[funcStartIdx] === '\n') {
      funcStartIdx++
    }
    let funcName = bodyStr.slice(funcStartIdx, parenIdx)
    let inside = getInsideOfFunc(bodyStr, `${funcName}`)
    pointer = getEndIdxOfFunc(bodyStr, `${funcName}`)
    let FuncStringified = `function ${funcName}() {
      ${inside}
    }`
    funcs.push(FuncStringified)
  }
}

module.exports = {
  getBody,
  getBetween,
  getEndIdxOfFunc,
  getInsideOfFunc,
  validBraces,
  getClassName,
}
