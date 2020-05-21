const { getInsideOfLifeCycle } = require('../commonUtils');

function mainGenericFunction(genericMethodArray, body, useEffects) {
  let genericMethodObject = createGenericMethodObj(genericMethodArray);
  genericMethodObject = searchBodyForOccurence(body, genericMethodObject);

  genericMethodObject = searchGenericMethodsForOccurence(genericMethodObject);

  genericMethodObject = searchLifeCycleForGenericMethod(
    useEffects,
    genericMethodObject
  );

  const updateUseEffects = addInGenericMethods(genericMethodObject, useEffects);

  return {
    useEffects: updateUseEffects,
    genericMethods: genericMethodObject.genericFilter,
  };
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
  const results = { genericFilter: [], useEffect: {} };
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

          if (results.useEffect[i]) {
            results.genericFilter.push(genericKeys[j]);
            results.useEffect[i].push(genericMethodTemplate);
            // results[i].push(genericMethodTemplate);
          } else {
            results.genericFilter.push(genericKeys[j]);
            results.useEffect[i] = [genericMethodTemplate];
          }
        }
      }
    }
  }
  for (let i in results.useEffect) {
    let temp = results.useEffect[i];
    for (let j in results.useEffect) {
      if (j !== i) {
        results.useEffect[i] = results.useEffect[i].filter(
          (val) => !results.useEffect[j].includes(val)
        );
        results.useEffect[j] = results.useEffect[j].filter(
          (val) => !temp.includes(val)
        );
      }
    }
  }
  console.log(results, 'fslhfs');
  return results;
}
function addInGenericMethods(genericMethodObject, useEffects) {
  const genericKeys = Object.keys(genericMethodObject.useEffect);

  for (let i = 0; i < genericKeys.length; i++) {
    const currentGeneric = genericKeys[i];
    const currentUseEffect = useEffects[currentGeneric];

    let useEffectBody = currentUseEffect.split(' ');
    let top = useEffectBody.slice(0, 4);
    useEffectBody = useEffectBody.slice(3);

    genericMethodObject.useEffect[currentGeneric].forEach((func) => {
      useEffectBody.unshift(`${func}\n`);
    });
    useEffects[currentGeneric] = top.join('') + useEffectBody.join('');
  }

  return useEffects;
}

function filterGenericMethods(originalMethods, removeMethods) {
  const object = createGenericMethodObj(originalMethods);

  for (let i = 0; i < removeMethods.length; i++) {
    delete object[removeMethods[i]];
  }
  let array = [];
  for (let j in object) {
    array.push(object[j].full);
  }
  return array;
}

module.exports = {
  mainGenericFunction,
  filterGenericMethods,
};
