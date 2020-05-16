function getBeforeReturn(string) {
  let renderIdx = string.indexOf('render')
  renderIdx = string.indexOf('{', renderIdx)
  const returnIdx = string.search(/return\s*?\(\s*?</)
  let middle = string
    .slice(renderIdx + 1, returnIdx /* string.indexOf('return', renderIdx) */)
    .trim()
  return middle
}

module.exports = {
  getBeforeReturn,
}
