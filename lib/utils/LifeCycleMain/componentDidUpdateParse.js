const { getIfConditional } = require('./commonLifeCycleUtils');
const { searchUnmountForParse } = require('./componentWillUnmountParse.js');
const { getInsideOfLifeCycle } = require('../commonUtils');

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
      updateObject = findPrevPropsForUpdate(string);
    }
    if (updateObject === -1) {
      let useEffectDidUpdateTemplate;
      const body = getInsideOfLifeCycle(string, method);
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
      ${getInsideOfLifeCycle(updateObject.conditional, 'if')}
      ${cleanup}
    }, [${updateObject.updateVariable}])`;
      } else {
        useEffectDidUpdateTemplate = `useEffect(() => {
          ${getInsideOfLifeCycle(updateObject.conditional, 'if')}
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

  updateVariable = updateVariable.replace(/[^a-zA-Z ]/g, '');

  const conditional = getIfConditional(string, 'if');
  conditional.updateVariable = updateVariable;
  return conditional;
}

// Find prev props for Component Did Update
function findPrevPropsForUpdate(string) {
  if (string.indexOf('if') === -1) {
    return -1;
  }
  let updateVariableString = string.slice(string.indexOf('if'));

  const re = /prevProps./gi;
  let match = re.exec(updateVariableString);
  if (match === null) {
    return -1;
  }

  let updateVariable = updateVariableString
    .slice(match.index + 10)
    .split(' ')[0];

  updateVariable = updateVariable.replace(/[^A-Za-z0-9]/g, '');
  updateVariable = 'props.' + updateVariable;
  const conditional = getIfConditional(string, 'if');
  conditional.updateVariable = updateVariable;
  return conditional;
}

module.exports = {
  findPrevStateForUpdate,
  createCompDidUpdateLifeCycle,
};
