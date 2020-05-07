function getBeforeReturn(string) {
  let renderIdx = string.indexOf('render')
  renderIdx = string.indexOf('{', renderIdx)
  let middle = string
    .slice(renderIdx + 1, string.indexOf('return', renderIdx))
    .trim()
  return middle
}

module.exports = {
  getBeforeReturn,
}
