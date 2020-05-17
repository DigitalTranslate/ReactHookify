const { getInsideOfFunc } = require('./commonLifeCycleUtils');

//useEffect Unmount Template
function createCompWillUnmountLifeCycle(string, method) {
  let useEffectDidUnMountTemplate = `useEffect(() => {
      return cleanup() => {
        ${getInsideOfFunc(string, method)}
      }
      })`;
  return useEffectDidUnMountTemplate;
}

//Cleanup return function template
function createCompWillUnmountCleanUp(string, method) {
  let useEffectDidUnMountTemplate = `return cleanup() => {
        ${getInsideOfFunc(string, method)}
      }`;
  return useEffectDidUnMountTemplate;
}

//Finds para in UnMount
function searchUnmountForParse(string) {
  const re = /(\()([a-z0-9_]+)(,)([ ]*)([a-z0-9_]+)(\))/i;
  let match = re.exec(string);
  if (match) {
    return match[0];
  } else {
    return -1;
  }
}

//Searchs other lifecycles for similar para
function checkUnmountForSimilarties(object) {
  const objectOfLifeCycleKeys = Object.keys(object);
  const componentWillUnmountIndex = objectOfLifeCycleKeys.indexOf(
    'componentWillUnmount()'
  );
  const UnMountParentheses = searchUnmountForParse(
    object[objectOfLifeCycleKeys[componentWillUnmountIndex]]
  );

  let UnmountArray = object[
    objectOfLifeCycleKeys[componentWillUnmountIndex]
  ].split(' ');
  UnmountArray = UnmountArray.filter((line) => {
    return line.indexOf(UnMountParentheses) === -1;
  });
  object[objectOfLifeCycleKeys[componentWillUnmountIndex]] = UnmountArray.join(
    ''
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
