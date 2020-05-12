const { getInsideOfFunc, validBraces } = require('./commonLifeCycleUtils');

function createCompDidMountLifeCycle(string, method) {
  let useEffectDidMountTemplate = `useEffect(() => {
      ${getInsideOfFunc(string, method)}}, [])`;

  return useEffectDidMountTemplate;
}

module.exports = {
  createCompDidMountLifeCycle,
};
