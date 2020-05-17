const { getInsideOfFunc, getIfConditional } = require('./commonLifeCycleUtils');
const { searchUnmountForParse } = require('./componentWillUnmountParse.js');

// Creates Single Component Did Update
function createCompDidUpdateLifeCycle(string, method, cleanup) {
  let cleanupPara;
  if (cleanup) {
    cleanupPara = searchUnmountForParse(cleanup);
  }
  let results = [];

  //Loops through Update body looking for conditionals
  while (string.length > 0) {
    let updateObject = findPrevStateForUpdate(string);

    if (updateObject === -1) {
      updateObject = findThisStateForUpdate(string);
    }
    // If no conditional
    if (updateObject === -1) {
      let useEffectDidUpdateTemplate;
      const body = getInsideOfFunc(string, method);
      if (body !== '') {
        if (body.includes(cleanupPara)) {
          useEffectDidUpdateTemplate = `useEffect(() => {
        ${body}
        ${cleanup}
      })`;
        } else {
          useEffectDidUpdateTemplate = `useEffect(() => {
          ${body}
        })`;
        }

        results.push(useEffectDidUpdateTemplate);
      }
      string = '';
      // If conditional
    } else {
      let useEffectDidUpdateTemplate;
      if (updateObject.conditional.includes(cleanupPara)) {
        useEffectDidUpdateTemplate = `useEffect(() => {
      ${updateObject.conditional}
      ${cleanup}
    }, [${updateObject.updateVariable}])`;
      } else {
        useEffectDidUpdateTemplate = `useEffect(() => {
          ${updateObject.conditional}
        }, [${updateObject.updateVariable}])`;
      }
      results.push(useEffectDidUpdateTemplate);
      string =
        string.slice(0, updateObject.startIdx) +
        string.slice(updateObject.endIdx, string.length);
    }
  }
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
};
