const { getInsideOfFunc, getIfConditional } = require('./commonLifeCycleUtils');

// Creates Single Component Did Update
function createCompDidUpdateLifeCycle(string, method, cleanup) {
  let results = [];
  while (string.length > 0) {
    let updateObject = findPrevStateForUpdate(string);

    if (updateObject === -1) {
      updateObject = findThisStateForUpdate(string);
    }
    if (updateObject === -1) {
      let useEffectDidUpdateTemplate = `useEffect(() => {
        ${getInsideOfFunc(string, method)}
        ${cleanup ? cleanup : ''}
      })`;
      results.push(useEffectDidUpdateTemplate);
      string = '';
    } else {
      let useEffectDidUpdateTemplate = `useEffect(() => {
      ${updateObject.conditional}
      ${cleanup ? cleanup : ''}
    }, [${updateObject.updateVariable}])`;

      results.push(useEffectDidUpdateTemplate);
      string =
        string.slice(0, updateObject.startIdx) +
        string.slice(updateObject.endIdx, string.length);
    }
  }
  return results;
}

//
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
  let updateVariableString = string.slice(string.indexOf('if'));

  const re = /prevState./gi;
  let match = re.exec(updateVariableString);
  if (match === null) {
    return -1;
  }

  let updateVariable = updateVariableString
    .slice(match.index + 10)
    .split(' ')[0];

  const conditional = getIfConditional(string, 'if');
  conditional.updateVariable = updateVariable;
  return conditional;
}

// Find this.state for Component Did Update
function findThisStateForUpdate(string) {
  if (string.indexOf('if') === -1) {
    return -1;
  }

  let updateVariableString = string.slice(string.indexOf('if'));

  const re = /this.state./gi;
  let match = re.exec(updateVariableString);

  if (match === -1) {
    return -1;
  }

  let updateVariable = updateVariableString
    .slice(match.index + 11)
    .split(' ')[0];

  const conditional = getIfConditional(string, 'if');
  conditional.updateVariable = updateVariable;
  return conditional;
}

module.exports = {
  findThisStateForUpdate,
  findPrevStateForUpdate,
  createCompDidUpdateLifeCycle,
  createMultipLeCompDidUpdateLifeCycle,
};
