const { getInsideOfFunc } = require('./commonUtils')

function getBeforeReturn(string) {
  let renderIdx = string.indexOf('render')
  renderIdx = string.indexOf('{', renderIdx)
  let returnIdx = string.search(/return\s*?\(\s*?</)
  returnIdx = returnIdx === -1 ? string.search(/return\s*?</) : returnIdx
  let middle = string
    .slice(renderIdx + 1, returnIdx /* string.indexOf('return', renderIdx) */)
    .trim()
  return middle
}

function handleRender(classDetails) {
  const { classCompInString } = classDetails
  const beforeReturn = getBeforeReturn(classCompInString)
  const returnSlice = getInsideOfFunc(classCompInString, 'render')
  return `${beforeReturn}
  return (
    ${returnSlice}
  )`
}

module.exports = {
  getBeforeReturn,
  handleRender,
}
