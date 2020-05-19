const { getInsideOfFunc } = require('./commonUtils')

function handleRender(classDetails) {
  const { classCompInString } = classDetails
  let renderIdx = classCompInString.search(/(render\()/)
  let renderSlice = classCompInString.slice(renderIdx)
  let returnSlice = getInsideOfFunc(renderSlice, 'render')
  return returnSlice
}

module.exports = {
  handleRender,
}
