/* eslint-disable no-lonely-if */
function hookifyPath(pathStr) {
  /*   '/public/client/app.js'    */
  let finalPath = pathStr
  const slicingIdx = pathStr.lastIndexOf('.')
  finalPath = pathStr.slice(0, slicingIdx)
  const fileType = pathStr.slice(slicingIdx)
  return `${finalPath}_Hookified${fileType}`
  /*   '/public/client/app_HOOKIFIED.js'    */
}

// returns the index for the start of the class component
function getClassCompIdx(string) {
  return string.search(/(class)([ \t]+)([\S]+)([ \t]+)(extends)/i)
}

// returns a slice of the whole class Component (removing everything above and below it)
function getClassComp(string, startIdx) {
  let stringSlice = string.slice(startIdx)
  let endIdxOfClassComp = getEndIdxOfFunc(stringSlice, 'Component')
  return stringSlice.slice(0, endIdxOfClassComp)
}

// Returns the name of the class
function getClassName(string, startIdx) {
  const classSlice = string.slice(startIdx)
  const nameOfClass = classSlice.split(/[ ]+/)[1]
  return nameOfClass
}

// Used to determine when a function has ended (aka the braces are valid)
// This is used inside the next two functions
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

// Returns everything between the starting and ending brackets of a function, object, or class
// Example input: 'componentDidMount() { const x = 5 }'
// Example output: 'const x = 5'
function getInsideOfFunc(string, methodStr) {
  let startIdx = string.indexOf(methodStr)
  if (startIdx === -1) return
  startIdx = string.indexOf('{', startIdx)
  let endIdx = startIdx + 1

  let funcSlice = string.slice(startIdx, endIdx)
  while (!validBraces(funcSlice)) {
    endIdx++
    funcSlice = string.slice(startIdx, endIdx)
  }
  if (funcSlice.indexOf('return') > -1) {
    return funcSlice
      .slice(funcSlice.indexOf('return') + 6, funcSlice.length - 2)
      .trim()
  } else {
    return funcSlice.slice(1, funcSlice.length - 2)
  }
}

// Very similar to the last function. Returns the index of when the function ends
// Example input: 'componentDidMount() { const x = 5 } '
// Example output: 35
function getEndIdxOfFunc(string, methodStr) {
  let startIdx = string.indexOf(methodStr)
  if (startIdx === undefined) return
  startIdx = string.indexOf('{', startIdx)
  let endIdx = startIdx + 1
  let funcSlice = string.slice(startIdx, endIdx)

  while (!validBraces(funcSlice)) {
    endIdx++
    funcSlice = string.slice(startIdx, endIdx)
  }
  return endIdx
}

// returns the body of the class component (aka everything after the constructor,
// or everything after Component { if there is no constructor
function getBody(string, startIdx) {
  let endIdx = getEndIdxOfFunc(string, 'Component') - 1 // add in React.Component Logic
  return string.slice(startIdx, endIdx).trim()
}

// Iterates through the body and adds all of the methods to an array called funcs.
// The methods are put into array as strings
// Example input: 'componentDidMount() { const x = 5 }  \n  method2() { const y = 6 }'
// Example output: ['componentDidMount() { const x = 5 }', 'method2() { const y = 6 }']
function getBodyMethods(funcs, bodyStr) {
  // find first non-white space (aka function starting index)
  let nextFuncIdx = bodyStr.search(/\S/)
  if (nextFuncIdx === -1) {
    return
  }

  let newBody = bodyStr.substring(nextFuncIdx)

  // if we find a comment, need to skip over it!
  // comment type: //
  if (newBody.slice(0, 2) === '//') {
    let newStartIdx = newBody.indexOf('\n') + 1
    newBody = newBody.substring(newStartIdx)
    getBodyMethods(funcs, newBody)
  }
  // comment type: /*   */
  else if (newBody.slice(0, 2) === '/*') {
    let newStartIdx = newBody.indexOf('*/') + 2
    newBody = newBody.substring(newStartIdx)
    getBodyMethods(funcs, newBody)
  }
  // if we find an actual method:
  else {
    let funcEndIdx = newBody.search(/[^a-zA-Z0-9_]/) // find function name ending index
    let funcName = newBody.slice(0, funcEndIdx)
    let funcArgs = newBody.slice(newBody.indexOf('(') + 1, newBody.indexOf(')'))
    let inside = getInsideOfFunc(bodyStr, `${funcName}`)
    let endOfFuncIdx = getEndIdxOfFunc(bodyStr, `${funcName}`)
    newBody = bodyStr.substring(endOfFuncIdx)

    let funcStringified = `function ${funcName}(${funcArgs}) {
      ${inside}
    }`
    if (funcName.toLowerCase() !== 'render') {
      funcs.push(funcStringified)
    }
    getBodyMethods(funcs, newBody)
  }
}

module.exports = {
  hookifyPath,
  getBodyMethods,
  getBody,
  getEndIdxOfFunc,
  getInsideOfFunc,
  validBraces,
  getClassName,
  getClassCompIdx,
  getClassComp,
}
