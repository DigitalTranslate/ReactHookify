const { getInsideOfFunc } = require('../commonUtils')

function createCompWillUnmountLifeCycle(string, method) {
  let useEffectDidUnMountTemplate = `useEffect(() => {
      return () => {
        ${getInsideOfFunc(string, method)}
      }
      })`
  return useEffectDidUnMountTemplate
}

module.exports = {
  createCompWillUnmountLifeCycle,
}
