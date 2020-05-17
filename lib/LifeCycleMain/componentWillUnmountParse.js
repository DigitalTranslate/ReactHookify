const { getInsideOfFunc, validBraces } = require('./commonLifeCycleUtils');

function createCompWillUnmountLifeCycle(string, method) {
  let useEffectDidUnMountTemplate = `useEffect(() => {
      return () => {
        ${getInsideOfFunc(string, method)}
      }
      })`;
  return useEffectDidUnMountTemplate;
}

function createCompWillUnmountCleanUp(string, method) {
  let useEffectDidUnMountTemplate = `return () => {
        ${getInsideOfFunc(string, method)}
      }`;
  return useEffectDidUnMountTemplate;
}

function searchUnmountForParse(string) {
  const re = /(\()([a-z0-9_]+)(,)([ ]*)([a-z0-9_]+)(\))/i;
  let match = re.exec(string);
  if (match) {
    return match[0];
  } else {
    return -1;
  }
}

function checkUnmountForSimilarties(object) {
  const objectOfLifeCycleKeys = Object.keys(object);
  const UnMountParentheses = searchUnmountForParse(
    object[
      objectOfLifeCycleKeys[
        objectOfLifeCycleKeys.indexOf('componentWillUnmount()')
      ]
    ]
  );
  if (UnMountParentheses === -1) {
    return -1;
  }
  const filteredKey = objectOfLifeCycleKeys.filter((lifecycle) => {
    return lifecycle !== 'componentWillUnmount()';
  });

  for (let i of filteredKey) {
    let similiar = searchUnmountForParse(object[i]);

    if (similiar === UnMountParentheses) {
      return i;
    }
  }
}

module.exports = {
  createCompWillUnmountLifeCycle,
  searchUnmountForParse,
  checkUnmountForSimilarties,
  createCompWillUnmountCleanUp,
};
