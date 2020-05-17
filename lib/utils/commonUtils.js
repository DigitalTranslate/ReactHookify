/* eslint-disable complexity */
/* eslint-disable no-lonely-if */

function capitalize(str) {
  //input 'dog'
  const firstLeter = str[0].toUpperCase()
  const newStr = firstLeter + str.slice(1, str.length)
  return newStr
  //output 'Dog'
}

function hookifyPath(pathStr) {
  /*   '/public/client/app.js'    */
  let finalPath = pathStr
  const slicingIdx = pathStr.lastIndexOf('.')
  finalPath = pathStr.slice(0, slicingIdx)
  const fileType = pathStr.slice(slicingIdx)
  return `${finalPath}_Hookified${fileType}`
  /*   '/public/client/app_Hookified.js'    */
}

function addAsyncTag(arrOfGenericMethods) {
  for (let idx = 0; idx < arrOfGenericMethods.length; idx++) {
    if (arrOfGenericMethods[idx].includes('await')) {
      arrOfGenericMethods[idx] = 'async ' + arrOfGenericMethods[idx]
    }
  }
}

function parseReactImport(classDetails, arrOfUseEffects, handledConstructor) {
  const strBeforeClassDeclaration = classDetails.beforeClass
  const startIdx = strBeforeClassDeclaration.search(
    /(import)(\WReact)(.*?)(react)/
  )
  const endIdx = strBeforeClassDeclaration.indexOf('react', startIdx) + 6
  const importToReplace = strBeforeClassDeclaration.slice(startIdx, endIdx)
  let imports = []
  if (/\=\WuseState([ ]*)\((.*?)\)/.test(handledConstructor)) {
    imports.push('useState')
  }
  if (arrOfUseEffects.length) {
    imports.push('useEffect')
  }
  if (importToReplace.includes('Fragment')) {
    imports.push('Fragment')
  }
  imports = imports.length ? `, {${imports.join(', ')}}` : ''
  const importTemplate = `import React${imports} from 'react'`
  return strBeforeClassDeclaration.replace(importToReplace, importTemplate)
}

//replaces all instances of .setState
function replaceSetState(classAsString) {
  function escapeRegExp(string) {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&')
  }
  let replacedStr = classAsString

  while (replacedStr.search(/(>)([ \t\n]*)(this.setState)/g) !== -1) {
    //this whole while loop is to account for implicit returns
    let startIdx = replacedStr.search(/(>)([ \t\n]*)(this.setState)/g) + 1

    let openIdx = replacedStr.indexOf('(', startIdx)
    let endIdx = openIdx + 1
    let funcSlice = replacedStr.slice(openIdx, endIdx)

    while (!validBraces(funcSlice)) {
      endIdx++
      funcSlice = replacedStr.slice(openIdx, endIdx)
    }

    let strToReplace = replacedStr.slice(startIdx, endIdx)
    strToReplace = escapeRegExp(strToReplace)
    let regex = new RegExp(`(>[ \\s]*)(${strToReplace.trim()})`, 'g')
    let replacer = function replacer(match, p1, p2) {
      p2 = `{${p2}}`
      return [p1, p2].join('')
    }
    replacedStr = replacedStr.replace(regex, replacer)
  }
  while (replacedStr.includes('this.setState')) {
    const asyncSetState = replacedStr.match(/(\S*)\s?(this\.setState)/)
    const isAsync = asyncSetState[1] === 'await'

    let startIdx = replacedStr.search('this.setState')
    if (isAsync) {
      startIdx = asyncSetState.index
    }
    let endIdx = getEndIdxOfFunc(replacedStr, 'this.setState') + 1 //this line needs looking at. lazy way to get endIdx right now. assumes some formatting.
    let strToReplace = replacedStr.slice(startIdx, endIdx)
    let awaitStr = isAsync ? 'await' : ''
    let setStateInsides = getInsideOfFunc(replacedStr, 'this.setState')
    let arrOfProps = parseSetStateIntoArr(setStateInsides)
    let replacementStr = arrOfProps
      .map((prop) => `${awaitStr} set${capitalize(prop[0])}(${prop[1]})`)
      .join(';\n')
    replacedStr = replacedStr.replace(strToReplace, replacementStr)
  }
  return replacedStr
}

function parseObjIntoArr(objInsides) {
  /*
INPUT:
"firstName: 'bob',
lastName: 'snob',
friends: ['joe', 'shmoe'],"

OUTPUT:
[[firstName, 'bob'], [lastName, 'snob'], [friends, ['joe','shmoe']]]
*/
  function storeNestedObjects(stateInsides, storage) {
    if (!stateInsides.includes('{')) {
      //might need to be more specific here
      return stateInsides
    } else {
      const startIdx = stateInsides.indexOf('{')
      let endIdx = startIdx + 1
      let funcSlice = stateInsides.slice(startIdx, endIdx)
      while (!validBraces(funcSlice)) {
        endIdx++
        funcSlice = stateInsides.slice(startIdx, endIdx)
      }
      let objToStore = funcSlice.slice(0, funcSlice.length)
      storage.push(objToStore)
      let newState = stateInsides.replace(objToStore, `|?$|props`)

      return storeNestedObjects(newState, storage)
    }
  }

  let storage = []

  if (/{\s*\S*:/g.test(objInsides)) {
    objInsides = storeNestedObjects(objInsides, storage)
  }

  //splits our state into an array
  const arrOfProps = objInsides
    .split(/,(?=\s+\S+:)/)
    .map((singleState) => singleState.trim().split(':'))
    //if obj had some nested objects, give them back here
    .map((singleState) => {
      if (singleState[1].includes('|?$|props')) {
        singleState[1] = storage.shift()
      }
      return singleState
    })

  return arrOfProps
}

function parseSetStateIntoArr(objInsides) {
  /*
INPUT:
"firstName: 'bob',
lastName: 'snob',
friends: ['joe', 'shmoe'],"

OUTPUT:
[[firstName, 'bob'], [lastName, 'snob'], [friends, ['joe','shmoe']]]
*/
  function storeNestedObjects(stateInsides, storage) {
    if (!stateInsides.includes('{')) {
      //might need to be more specific here
      return stateInsides
    } else {
      const startIdx = stateInsides.indexOf('{')
      let endIdx = startIdx + 1
      let funcSlice = stateInsides.slice(startIdx, endIdx)
      while (!validBraces(funcSlice)) {
        endIdx++
        funcSlice = stateInsides.slice(startIdx, endIdx)
      }
      let objToStore = funcSlice.slice(0, funcSlice.length)
      storage.push(objToStore)
      let newState = stateInsides.replace(objToStore, `|?$|props`)

      return storeNestedObjects(newState, storage)
    }
  }

  let storage = []

  if (/{\s*\S*:/g.test(objInsides)) {
    objInsides = storeNestedObjects(objInsides, storage)
  }
  //splits our state into an array
  const arrOfProps = objInsides
    .split(/,(?=\s+\S+:)/)
    .map((singleState) => {
      if (!singleState.includes(':')) {
        return `${singleState}:${singleState}`
      }
      return singleState
    })
    .map((singleState) => singleState.trim().split(':'))
    //if obj had some nested objects, give them back here
    .map((singleState) => {
      if (singleState[1].includes('|?$|props')) {
        singleState[1] = storage.shift()
      }
      return singleState
    })
  return arrOfProps
}

// // returns the index for the start of the class component
// function getClassCompIdx(string) {
//   return string.search(/(class)([ \t]+)([\S]+)([ \t]+)(extends)/i)
// }

// returns a slice of the whole class Component (removing everything above and below it)
// function getClassComp(string, startIdx) {
//   let stringSlice = string.slice(startIdx)
//   let endIdxOfClassComp = getEndIdxOfFunc(stringSlice, 'Component')
//   return stringSlice.slice(0, endIdxOfClassComp)
// }

// Returns the name of the class
// function getClassName(string, startIdx) {
//   const classSlice = string.slice(startIdx)
//   const nameOfClass = classSlice.split(/[ ]+/)[1]
//   return nameOfClass
// }

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
  if (methodStr === 'render') {
    // if (funcSlice.indexOf('return') > -1) {
    let returnIdx = funcSlice.search(/return\s*?\(\s*?</)
    returnIdx = returnIdx === -1 ? funcSlice.search(/return\s*?</) : returnIdx
    return funcSlice
      .slice(
        /* funcSlice.indexOf('return') + 6 */ returnIdx + 6,
        funcSlice.length - 2
      )
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

// more modular version of previosu functions (supports '{([')
function getEndIdxOfBraces(string) {
  let startIdx = string.search(/[{[(]/)
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
function getBody(classDetails) {
  let genericMethods = []
  const { classCompInString, startOfBodyIdx } = classDetails
  let endIdx = getEndIdxOfFunc(classCompInString, 'Component') - 1 // add in React.Component Logic
  const body = classCompInString.slice(startOfBodyIdx, endIdx).trim()
  getBodyMethods(genericMethods, body)

  genericMethods = removeLifecycles(genericMethods)

  addAsyncTag(genericMethods)

  return { body, genericMethods }
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
    let funcNameModified
    let funcName = newBody.slice(0, newBody.indexOf('('))
    if (funcName.slice(0, 5) === 'async') {
      funcName = funcName.substring(6)
    }
    if (funcName.includes('=')) {
      funcNameModified = funcName.replace('=', '')
      funcNameModified = funcNameModified.replace('async', '')
    } else {
      funcNameModified = funcName
    }
    let funcArgs = newBody.slice(newBody.indexOf('(') + 1, newBody.indexOf(')'))
    let inside = getInsideOfFunc(bodyStr, `${funcName}`)
    let endOfFuncIdx = getEndIdxOfFunc(bodyStr, `${funcName}`)
    newBody = bodyStr.substring(endOfFuncIdx)

    let funcStringified = `function ${funcNameModified}(${funcArgs}) {
      ${inside}
    }`
    if (funcNameModified.toLowerCase() !== 'render') {
      funcs.push(funcStringified)
    }
    /*
    Will need this to handle get/set/static
    if (
      funcName.toLowerCase() !== 'render' &&
      funcName.toLowerCase() === 'componentdidmount' &&
      funcName.toLowerCase() === 'componentdidupdate' &&
      funcName.toLowerCase() === 'componentDidMount'
    ) {
      funcs.push(funcStringified)
    }
    if (
      funcName.includes('componentDidMount') ||
      funcName.includes('componentDidUpdate') ||
      funcName.includes('componentWillMount')
    ) {
      lifecyclesArr.push(funcStringified.slice(8))
    }
    */
    getBodyMethods(funcs, newBody)
  }
}

function removeLifecycles(funcs) {
  return funcs.filter((lifecycle) => {
    let name = lifecycle.slice(9, lifecycle.indexOf('('))
    let testArr = [
      'componentDidMount',
      'componentDidUpdate',
      'componentWillUnmount',
    ]
    return !testArr.includes(name)
  })
}

module.exports = {
  addAsyncTag,
  capitalize,
  hookifyPath,
  getBodyMethods,
  getBody,
  getEndIdxOfFunc,
  getInsideOfFunc,
  validBraces,
  // getClassName,
  parseObjIntoArr,
  replaceSetState,
  // getClassCompIdx,
  // getClassComp,
  getEndIdxOfBraces,
  parseReactImport,
  removeLifecycles,
}
