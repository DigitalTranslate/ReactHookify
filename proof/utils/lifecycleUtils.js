const componentString = `componentDidMount() {
  document.title = this.state.counter;
}

componentDidUpdate() {
  document.title = this.state.counter;
}`

//Loops through string and finds components-lifecycle-methods, storing them in a object with the key being the name of thelifecycle method and the value being the code block
function findComponents(string) {
  const componentTypes = [
    'componentDidMount()',
    'componentDidUpdate()',
    'componentWillUnmount()',
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

      returnedComponents[currentComponent] = componentSlice.replace(
        /this.state./gi,
        ''
      )

      // returnedComponents.push(componentSlice);
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

console.log(findComponents(componentString), 'COMPONENT OBJECT')

const componentLifeCycleMethods = findComponents(componentString)
for (let i in componentLifeCycleMethods) {
  let currentKey = i
  let currentValue = componentLifeCycleMethods[i]
  const useEffect = createUseEffect(currentValue, currentKey)
  console.log(useEffect, 'CREATE USE EFFECT')
}
