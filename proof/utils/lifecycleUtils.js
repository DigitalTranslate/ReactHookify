const { str0, str1, str2, str3, str4 } = require('./exampleClass')
const { getInsideOfFunc, validBraces } = require('./commonUtils')
//Loops through string and finds components-lifecycle-methods, storing them in a object with the key being the name of thelifecycle method and the value being the code block
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

      returnedComponents[currentComponent + ')'] = componentSlice.replace(
        /this.state./gi,
        ''
      )
    }
  }
  return returnedComponents
}

//Create a simple useEffect function from template, this assumes the collect lifecycle method is a single line
function createUseEffect(string, method) {
  let useEffectTemplate = `useEffect(() => {
  ${getInsideOfFunc(string, method)}})`
  return useEffectTemplate
}

function createMultipleUseEffects(objectOfLifeCycle) {
  let useEffectResults = []
  // eslint-disable-next-line guard-for-in
  for (let i in objectOfLifeCycle) {
    let currentKey = i
    let currentValue = objectOfLifeCycle[i]
    const useEffect = createUseEffect(currentValue, currentKey)
    useEffectResults.push(useEffect)
  }
  const uniqueSet = new Set(useEffectResults)
  const uniqueSetArray = [...uniqueSet]
  return uniqueSetArray
}

module.exports = {
  findComponents,
  createUseEffect,
  createMultipleUseEffects,
}
