const { getInsideOfLifeCycle } = require('../commonUtils');

function mainGenericFunction(genericMethodArray, body, useEffects) {
  let genericMethodObject = createGenericMethodObj(genericMethodArray);
  genericMethodObject = searchBodyForOccurence(body, genericMethodObject);
  genericMethodObject = searchGenericMethodsForOccurence(genericMethodObject);
  genericMethodObject = searchLifeCycleForGenericMethod(
    useEffects,
    genericMethodObject
  );
  console.log(genericMethodObject);
}

function createGenericMethodObj(genericMethodArray) {
  let object = {};
  for (let i = 0; i < genericMethodArray.length; i++) {
    const currentMethod = genericMethodArray[i];
    const currentMethodSplit = currentMethod.split(' ');

    let functionName =
      currentMethodSplit[currentMethodSplit.indexOf('function') + 1];

    const body = getInsideOfLifeCycle(currentMethod, functionName);
    object[functionName] = { body: body, full: currentMethod };
  }

  return object;
}

function searchBodyForOccurence(body, methodObject) {
  let updateMethodObject = methodObject;
  const keys = Object.keys(methodObject);
  let remove = [];
  body = body.slice(body.indexOf('render()'));
  for (let i = 0; i < keys.length; i++) {
    if (body.includes(keys[i])) {
      remove.push(keys[i]);
    }
  }
  remove = Array.from(new Set(remove));
  remove.forEach((key) => {
    delete updateMethodObject[key];
  });

  return updateMethodObject;
}

function searchGenericMethodsForOccurence(object) {
  let updateMethodObject = object;
  const keys = Object.keys(object);
  let remove = [];
  let counter = 0;
  for (let i = 0; i < keys.length; i++) {
    if (counter > 1) {
      return -1;
    }
    for (let j = 0; j < keys.length; j++) {
      if (j !== i) {
        if (object[keys[j]].body.includes(keys[i])) {
          remove.push(keys[i]);
        }
      }
    }
  }
  remove = Array.from(new Set(remove));
  remove.forEach((key) => {
    delete updateMethodObject[key];
  });
  return updateMethodObject;
}

function searchLifeCycleForGenericMethod(useEffectArray, genericMethodObject) {
  const re = /[^A-Za-z0-9]/g;

  const genericKeys = Object.keys(genericMethodObject);
  const results = {};

  for (let i = 0; i < useEffectArray.length; i++) {
    let currentLifeCycle = useEffectArray[i];
    for (let j = 0; j < genericKeys.length; j++) {
      let currentMethod = genericKeys[j];
      if (currentLifeCycle.includes(currentMethod)) {
        const startIdx = currentLifeCycle.indexOf(currentMethod);

        currentLifeCycle = currentLifeCycle.slice(startIdx);

        const charAtIndex = currentMethod.length;
        const match = currentLifeCycle.charAt(charAtIndex).match(re);

        if (match !== null) {
          const genericMethodTemplate =
            genericMethodObject[genericKeys[j]].full;
          console.log(results);
          results[currentMethod] = [useEffectArray[i], genericMethodTemplate];
        } else {
          return -1;
        }
      }
    }
  }
  return results;
}
module.exports = {
  mainGenericFunction,
};
