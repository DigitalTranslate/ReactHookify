const { getInsideOfFunc } = require('../commonUtils')

function createCompDidMountLifeCycle(string, method, cleanup) {
  let useEffectDidMountTemplate = `useEffect(() => {
      ${getInsideOfFunc(string, method)}
    ${cleanup ? cleanup : ''}
    }, [])`

  return useEffectDidMountTemplate
}

module.exports = {
  createCompDidMountLifeCycle,
}
