/* eslint-disable no-lonely-if */
const fs = require('fs')

let str = `import statement

class    testApp extends Component {

  render() {
    return <div>{array[1]}</div>;
  }
}
export something
`

function translate(string) {
  const propsCheck = string.includes('props') ? 'props' : ''
  const nameOfClass = getClassName(string)
  const renderSlice = getRender(string)

  return `function ${nameOfClass}(${propsCheck}) {
    return (
      ${renderSlice}
    )
  }`
}

//TEST FOR WRITING FILE
// fs.writeFile('proof.js', translate(str), (err) => {
//   if (err) throw err
//   console.log('done')
// })

console.log(translate(str))

function getClassName(string) {
  const classIdx = string.indexOf('class')
  const classSlice = string.slice(classIdx)
  const nameOfClass = classSlice.split(/[ ]+/)[1]
  return nameOfClass
}

function getRender(string) {
  let renderIdx = string.indexOf('render')
  renderIdx = string.indexOf('{', renderIdx)
  let renderEndIdx = renderIdx + 1
  let renderSlice = string.slice(renderIdx, renderEndIdx)
  while (!validBraces(renderSlice)) {
    renderEndIdx++
    renderSlice = string.slice(renderIdx, renderEndIdx)
  }
  renderSlice = renderSlice
    .slice(renderSlice.indexOf('return') + 6, renderSlice.length - 2)
    .trim()
  return renderSlice
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
