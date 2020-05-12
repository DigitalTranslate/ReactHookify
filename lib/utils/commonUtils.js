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

//replaces all instances of this.setState
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
    let startIdx = replacedStr.search('this.setState')
    let endIdx = getEndIdxOfFunc(replacedStr, 'this.setState') + 1 //this line needs looking at. lazy way to get endIdx right now. assumes some formatting.
    let strToReplace = replacedStr.slice(startIdx, endIdx)
    let setStateInsides = getInsideOfFunc(replacedStr, 'this.setState')
    let arrOfProps = parseObjIntoArr(setStateInsides)
    let replacementStr = arrOfProps
      .map((prop) => `set${capitalize(prop[0])}(${prop[1]})`)
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

  if (objInsides.includes('{')) {
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
function getBody(string, startIdx) {
  let endIdx = getEndIdxOfFunc(string, 'Component') - 1 // add in React.Component Logic
  return string.slice(startIdx, endIdx).trim()
}

function getBodyMethods(funcs, bodyStr) {
  // find first non-white space (aka function starting index)
  let nonWhiteSpaceIdx = bodyStr.search(/\S/)
  if (nonWhiteSpaceIdx === -1) {
    return
  }
  let newBody = bodyStr.substring(nonWhiteSpaceIdx)
  let funcEndIdx = newBody.search(/[^a-zA-Z0-9_]/) // find function name ending index
  let funcName = newBody.slice(0, funcEndIdx)
  let inside = getInsideOfFunc(bodyStr, `${funcName}`)
  let endOfFuncIdx = getEndIdxOfFunc(bodyStr, `${funcName}`)
  newBody = bodyStr.substring(endOfFuncIdx)

  let funcStringified = `function ${funcName}() {
      ${inside}
    }`
  if (funcName.toLowerCase() !== 'render') {
    funcs.push(funcStringified)
  }
  getBodyMethods(funcs, newBody)
}

module.exports = {
  capitalize,
  hookifyPath,
  getBodyMethods,
  getBody,
  getEndIdxOfFunc,
  getInsideOfFunc,
  validBraces,
  getClassName,
  parseObjIntoArr,
  replaceSetState,
}
