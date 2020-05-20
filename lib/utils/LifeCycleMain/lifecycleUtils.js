const {
  getInsideOfFunc,
  validBraces,
  getInsideOfLifeCycle,
} = require('../commonUtils')
const { createCompDidMountLifeCycle } = require('./componentDidMountParse')
const { createCompDidUpdateLifeCycle } = require('./componentDidUpdateParse')
const { iterator } = require('./groupUseEffects')
const {
  createCompWillUnmountLifeCycle,
  createCompWillUnmountCleanUp,
  searchUnmountForParse,
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
    let similarities
    if (
      objectOfLifeCycleKeys.includes('componentDidMount()') &&
      objectOfLifeCycleKeys.includes('componentDidUpdate()')
    ) {
      similarities = checkMountAndUpdateForSimilarties(objectOfLifeCycle)
    }

    // Search lifecycles for similiar Unmount function
    // let similiarUnmount;
    // if (objectOfLifeCycleKeys.includes('componentWillUnmount()')) {
    //   const checkUnmount = checkUnmountForSimilarties(objectOfLifeCycle);
    //   if (checkUnmount !== -1) {
    //     similiarUnmount = checkUnmount;
    //   }
    // }

    // Sends updated lifecycle object to be created into useEffect templates
    if (similarities === -1 || similarities === undefined) {
      return multiuseEffectCreate(objectOfLifeCycle)
    } else {
      return multiuseEffectCreate(similarities)
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
function multiuseEffectCreate(object) {
  let results = {}
  let lifecycleObject = object

  // If instance of a cleanup, create useEffect with cleanup and remove from lifecycle object
  // if (cleanup) {
  //   results[cleanup] = handleCleanupCreate(lifecycleObject, cleanup);
  // }
  // Creates useEffects
  for (let i in lifecycleObject) {
    const key = i
    const value = lifecycleObject[i]

    let useEffect = createSingleUseEffect(value, key)
    results[key] = useEffect
  }
  return results
}

// Returns cleanup template and filters new object
function handleCleanupCreate(lifecycleObject, cleanup) {
  let UnMountParentheses = searchUnmountForParse(
    lifecycleObject['componentWillUnmount()']
  ).split(' ')

  let UnmountStringCleanup = lifecycleObject['componentWillUnmount()'].split(
    ' '
  )

  UnmountStringCleanup = UnmountStringCleanup.filter((line) => {
    if (
      line.indexOf(UnMountParentheses[0]) !== -1 ||
      line.indexOf(UnMountParentheses[1]) !== -1
    ) {
      return line
    }
  })

  const cleanUpString = createCompWillUnmountCleanUp(
    UnmountStringCleanup.join(' ')
  )

  const cleanupUseEffect = createSingleUseEffect(
    lifecycleObject[cleanup],
    cleanup,
    cleanUpString
  )

  // Adds the useEffect template with cleanup to final return object
  // Deletes old lifecycle object key
  delete lifecycleObject[cleanup]

  // Filters used line in Unmount out
  // let UnmountArray = lifecycleObject['componentWillUnmount()'].split(' ');
  // console.log(UnmountArray.indexOf(UnMountParentheses[0]) === -1);
  // UnmountArray = UnmountArray.filter((line) => {
  //   if (
  //     line.indexOf(UnMountParentheses[0]) === -1 ||
  //     line.indexOf(UnMountParentheses[1]) === -1
  //   ) {
  //     return line;
  //   }
  // });
  // console.log(UnmountArray);
  // lifecycleObject['componentWillUnmount()'] = UnmountArray.join(' ');
  // if (
  //   getInsideOfFunc(
  //     lifecycleObject['componentWillUnmount()'],
  //     'componentWillUnmount()'
  //   ) === ''
  // ) {
  //   delete lifecycleObject['componentWillUnmount()'];
  // }

  return cleanupUseEffect
}

//Finds similar lines in Mount and Update and updates lifecycle methods to be created into useEffects
function checkMountAndUpdateForSimilarties(object) {
  const objectOfLifeCycleKeys = Object.keys(object)
  let componentDidMountBodyArray = []

  if (
    objectOfLifeCycleKeys.includes('componentDidMount()') &&
    objectOfLifeCycleKeys.includes('componentDidUpdate()')
  ) {
    const componentDidMountbodyString = getInsideOfLifeCycle(
      object[objectOfLifeCycleKeys[0]],
      objectOfLifeCycleKeys[0]
    )
    let bodyMountLineArray = componentDidMountbodyString.split(/\r?\n/)
    bodyMountLineArray = bodyMountLineArray.map((line) => {
      return line.trim()
    })
    componentDidMountBodyArray = bodyMountLineArray

    if (objectOfLifeCycleKeys[1] === 'componentDidUpdate()') {
      const componentDidUpdatebodyString = getInsideOfLifeCycle(
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
  const array = []
  for (let key in modifiedLifecyclesObj) {
    if (Array.isArray(modifiedLifecyclesObj[key])) {
      array.push(...modifiedLifecyclesObj[key])
    } else {
      array.push(modifiedLifecyclesObj[key])
    }
  }
  // const arrOfUseEffects = iterator(modifiedLifecyclesObj);
  handleAsync(array)
  return array
}

module.exports = {
  findComponents,
  createSingleUseEffect,
  createUseEffects,
  handleAsync,
  getUseEffects,
}
