const { getInsideOfLifeCycle } = require('../commonUtils');

function createCompDidMountLifeCycle(string, method, cleanup) {
  let useEffectDidMountTemplate = `useEffect(() => {
      ${getInsideOfLifeCycle(string, method)}
    ${cleanup ? cleanup : ''}
    }, [])`;

  return useEffectDidMountTemplate;
}

module.exports = {
  createCompDidMountLifeCycle,
};
