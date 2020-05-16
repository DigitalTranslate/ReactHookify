const { getInsideOfFunc } = require('./commonLifeCycleUtils');

// Creates Component Did Update
function createCompDidUpdateLifeCycle(string, method, cleanup) {
  let updateVariable = findPrevStateForUpdate(string);
  if (updateVariable === -1) {
    updateVariable = findThisStateForUpdate(string);
  }
  if (updateVariable === -1) {
    let useEffectDidUpdateTemplate = `useEffect(() => {
        ${getInsideOfFunc(string, method)}
        ${cleanup ? cleanup : ''}
      })`;
    return useEffectDidUpdateTemplate;
  }

  let useEffectDidUpdateTemplate = `useEffect(() => {
      ${getInsideOfFunc(string, method)}
      ${cleanup ? cleanup : ''}
    }, [${updateVariable}])`;

  return useEffectDidUpdateTemplate;
}

function createMultipLeCompDidUpdateLifeCycle(string, method, cleanup) {
  const results = [];
  const useEffectDidUpdateTemplate = createCompDidUpdateLifeCycle(
    string,
    method,
    cleanup
  );
  results.push(useEffectDidUpdateTemplate);
  return results;
}

// Find prev state for Component Did Update
function findPrevStateForUpdate(string) {
  if (string.indexOf('if') === -1) {
    return -1;
  }
  const re = /prevState./gi;
  let match = re.exec(string);
  if (match === null) {
    return -1;
  }
  let index;
  while ((match = re.exec(string)) != null) {
    index = match.index;
  }
  return string.slice(index + 10).split(' ')[0];
}

// Find this.state for Component Did Update
function findThisStateForUpdate(string) {
  if (string.indexOf('if') === -1) {
    return -1;
  }
  string = string.slice(string.indexOf('if')).slice(0, string.indexOf('{'));

  const re = /this.state./gi;
  let match = re.exec(string);
  if (match === -1) {
    return -1;
  }

  return string.slice(match.index + 11).split(' ')[0];
}

module.exports = {
  findThisStateForUpdate,
  findPrevStateForUpdate,
  createCompDidUpdateLifeCycle,
  createMultipLeCompDidUpdateLifeCycle,
};
