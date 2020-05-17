const { getInsideOfFunc, validBraces } = require('../commonUtils')
const { createCompDidMountLifeCycle } = require('./componentDidMountParse')
const { createCompDidUpdateLifeCycle } = require('./componentDidUpdateParse')
const { iterator } = require('./groupUseEffects')
const {
  createCompWillUnmountLifeCycle,
  checkUnmountForSimilarties,
  createCompWillUnmountCleanUp,
} = require('./componentWillUnmountParse')
//Loops through string and finds components-lifecycle-methods,
//storing them in a object with the key being the name of thelifecycle method and the value being the code block
function findComponents(string) {
  const componentTypes = [
    'componentDidMount(',
    'componentDidUpdate(',
    'componentWillUnmount(',
  ]
  const returnedComponents = {}
  for (let i = 0; i < componentTypes.length; i++) {
    const currentComponent = componentTypes[i]
    if (string.indexOf(currentComponent) !== -1) {
      let componentIndex = string.indexOf(currentComponent)
      let bracketIndex = string.indexOf('{', componentIndex)
      let componentEndIndex = bracketIndex + 1
      let componentSlice = string.slice(bracketIndex, componentEndIndex)
      while (!validBraces(componentSlice)) {
        componentEndIndex++
        componentSlice = string.slice(bracketIndex, componentEndIndex)
      }
      componentSlice = string.slice(componentIndex, componentEndIndex)
      returnedComponents[currentComponent + ')'] = componentSlice
    }
  }
  return returnedComponents
}
//Creates routes for creating useEffects, Checks for type of Lifecycle Method
//Takes in object of lifecycle hooks, routes to different useEffect creatations
function createUseEffects(objectOfLifeCycle) {
  const objectOfLifeCycleKeys = Object.keys(objectOfLifeCycle)
  if (objectOfLifeCycleKeys.length === 1) {
    let useEffect = createSingleUseEffect(
      objectOfLifeCycle[objectOfLifeCycleKeys[0]],
      objectOfLifeCycleKeys[0]
    )
    let results = {}
    results[objectOfLifeCycleKeys[0]] = useEffect
    return results
  } else {
    // Mount and Update
    const similarities = checkMountAndUpdateForSimilarties(objectOfLifeCycle)
    let similiarUnmount
    // Search lifecycles for similiar Unmount function
    if (objectOfLifeCycleKeys.includes('componentWillUnmount()')) {
      const check = checkUnmountForSimilarties(objectOfLifeCycle)
      if (check !== -1) {
        similiarUnmount = check
      }
    }
    if (similarities === -1) {
      return multiuseEffectCreate(objectOfLifeCycle, similiarUnmount)
    } else {
      return multiuseEffectCreate(similarities, similiarUnmount)
    }
  }
}
//Creates useEffect from body of lifecycle method that is passed in
function createSingleUseEffect(string, method, cleanup) {
  if (method === 'componentDidMount()') {
    return createCompDidMountLifeCycle(string, method, cleanup)
  } else if (method === 'componentDidUpdate()') {
    return createCompDidUpdateLifeCycle(string, method, cleanup)
  } else if (method === 'componentWillUnmount()') {
    return createCompWillUnmountLifeCycle(string, method)
  }
}
// Loops through object containing Lifecycle methods and creates useEffect
function multiuseEffectCreate(object, cleanup) {
  let results = {}
  let lifecycleObject = object
  if (cleanup) {
    const cleanUpString = createCompWillUnmountCleanUp(
      lifecycleObject['componentWillUnmount()']
    )
    const cleanupUseEffect = createSingleUseEffect(
      lifecycleObject[cleanup],
      cleanup,
      cleanUpString
    )
    results[cleanup] = cleanupUseEffect
    delete lifecycleObject[cleanup]
  }
  for (let i in lifecycleObject) {
    const key = i
    const value = lifecycleObject[i]
    let useEffect = createSingleUseEffect(value, key)
    results[key] = useEffect
  }
  return results
}
//Finds similar lines in Mount and Update and updates lifecycle methods to be created into useEffects
function checkMountAndUpdateForSimilarties(object) {
  const objectOfLifeCycleKeys = Object.keys(object)
  let componentDidMountBodyArray = []
  if (
    objectOfLifeCycleKeys[0] === 'componentDidMount()' &&
    objectOfLifeCycleKeys[1] === 'componentDidUpdate()'
  ) {
    const componentDidMountbodyString = getInsideOfFunc(
      object[objectOfLifeCycleKeys[0]],
      objectOfLifeCycleKeys[0]
    )
    let bodyMountLineArray = componentDidMountbodyString.split(/\r?\n/)
    bodyMountLineArray = bodyMountLineArray.map((line) => {
      return line.trim()
    })
    componentDidMountBodyArray = bodyMountLineArray
    if (objectOfLifeCycleKeys[1] === 'componentDidUpdate()') {
      const componentDidUpdatebodyString = getInsideOfFunc(
        object[objectOfLifeCycleKeys[1]],
        objectOfLifeCycleKeys[1]
      )
      let bodyUpdateLineArray = componentDidUpdatebodyString.split(/\r?\n/)
      bodyUpdateLineArray = bodyUpdateLineArray.map((line) => {
        return line.trim()
      })
      for (let i = 0; i < bodyUpdateLineArray.length; i++) {
        const currentLine = bodyUpdateLineArray[i]
        const index = componentDidMountBodyArray.indexOf(currentLine)
        if (index > -1) {
          componentDidMountBodyArray = componentDidMountBodyArray.splice(
            index,
            1
          )
        }
      }
      if (componentDidMountBodyArray.length === 0) {
        return -1
      } else {
        bodyMountLineArray = bodyMountLineArray.map((line) => {
          if (bodyUpdateLineArray.indexOf(line.trim()) === -1) {
            return line + '\n'
          } else {
            return ''
          }
        })
        if (bodyMountLineArray[0] !== undefined) {
          object['componentDidMount()'] =
            'componentDidMount() {\n' +
            `   ${bodyMountLineArray.join(' ')}` +
            '  }'
        } else {
          delete object['componentDidMount()']
        }
        return object
      }
    }
  }
}

function handleAsync(arrOfUseEffects) {
  for (let idx = 0; idx < arrOfUseEffects.length; idx++) {
    let useEffect = arrOfUseEffects[idx]
    if (useEffect.includes('await')) {
      let useEffectInnards = getInsideOfFunc(useEffect, 'useEffect')
      arrOfUseEffects[idx] = useEffect.replace(
        useEffectInnards,
        `(async () => {${useEffectInnards}})()`
      )
    }
  }
}

function getUseEffects(bodyAsStr) {
  const initialLifecyclesObj = findComponents(bodyAsStr)
  const modifiedLifecyclesObj = createUseEffects(initialLifecyclesObj)
  const arrOfUseEffects = iterator(modifiedLifecyclesObj)
  handleAsync(arrOfUseEffects)
  return arrOfUseEffects
}

module.exports = {
  findComponents,
  createSingleUseEffect,
  createUseEffects,
  handleAsync,
  getUseEffects,
}
