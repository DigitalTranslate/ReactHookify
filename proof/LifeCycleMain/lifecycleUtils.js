const { str0, str1, str2, str3, str4, str5 } = require('../utils/exampleClass');
const { getInsideOfFunc, validBraces } = require('./commonLifeCycleUtils');
const { createCompDidMountLifeCycle } = require('./componentDidMountParse');
const { createCompDidUpdateLifeCycle } = require('./componentDidUpdateParse');
const {
  createCompWillUnmountLifeCycle,
} = require('./componentWillUnmountParse');

//Loops through string and finds components-lifecycle-methods,
//storing them in a object with the key being the name of thelifecycle method and the value being the code block
function findComponents(string) {
  const componentTypes = [
    'componentDidMount(',
    'componentDidUpdate(',
    'componentWillUnmount(',
  ];
  const returnedComponents = {};
  for (let i = 0; i < componentTypes.length; i++) {
    const currentComponent = componentTypes[i];

    if (string.indexOf(currentComponent) !== -1) {
      let componentIndex = string.indexOf(currentComponent);

      let bracketIndex = string.indexOf('{', componentIndex);
      let componentEndIndex = bracketIndex + 1;
      let componentSlice = string.slice(bracketIndex, componentEndIndex);

      while (!validBraces(componentSlice)) {
        componentEndIndex++;
        componentSlice = string.slice(bracketIndex, componentEndIndex);
      }
      componentSlice = string.slice(componentIndex, componentEndIndex);

      returnedComponents[currentComponent + ')'] = componentSlice;
    }
  }
  return returnedComponents;
}

//Creates useEffect from body of lifecycle method that is passed in
function createSingleUseEffect(string, method) {
  if (method === 'componentDidMount()') {
    return createCompDidMountLifeCycle(string, method);
  } else if (method === 'componentDidUpdate()') {
    return createCompDidUpdateLifeCycle(string, method);
  } else if (method === 'componentWillUnmount()') {
    return createCompWillUnmountLifeCycle(string, method);
  }
}

// Loops through object containing Lifecycle methods and creates useEffect
function multiuseEffectCreate(object) {
  let results = [];
  for (let i in object) {
    const key = i;
    const value = object[i];
    const useEffect = createSingleUseEffect(value, key);
    results.push(useEffect);
  }
  return results;
}

//Finds similar lines in Mount and Update and updates lifecycle methods to be created into useEffects
function checkMountAndUpdateForSimilarties(object) {
  const objectOfLifeCycleKeys = Object.keys(object);
  let componentDidMountBodyArray = [];
  if (
    objectOfLifeCycleKeys[0] === 'componentDidMount()' &&
    objectOfLifeCycleKeys[1] === 'componentDidUpdate()'
  ) {
    const componentDidMountbodyString = getInsideOfFunc(
      object[objectOfLifeCycleKeys[0]],
      objectOfLifeCycleKeys[0]
    );
    let bodyMountLineArray = componentDidMountbodyString.split(/\r?\n/);
    bodyMountLineArray = bodyMountLineArray.map((line) => {
      return (line = line.trim());
    });

    componentDidMountBodyArray = bodyMountLineArray;

    if (objectOfLifeCycleKeys[1] === 'componentDidUpdate()') {
      const componentDidUpdatebodyString = getInsideOfFunc(
        object[objectOfLifeCycleKeys[1]],
        objectOfLifeCycleKeys[1]
      );

      const bodyUpdateLineArray = componentDidUpdatebodyString.split(/\r?\n/);
      console.log(bodyUpdateLineArray, 'bodyUpdateLineArray');
      console.log(componentDidMountBodyArray, 'componentDidMountBodyArray');

      for (let i = 0; i < bodyUpdateLineArray.length; i++) {
        const currentLine = bodyUpdateLineArray[i];
        const index = componentDidMountBodyArray.indexOf(currentLine);
        if (index > -1) {
          componentDidMountBodyArray = componentDidMountBodyArray.splice(
            index,
            1
          );
        }
      }
      // const updatedMountBody = [];
      // for (let i = 0; i < bodyUpdateLineArray.length; i++) {
      //   const currentUpdateLine = bodyUpdateLineArray[i].trim();

      //   for (let j = 0; j < componentDidMountBodyArray.length; j++) {
      //     const currentMountLine = componentDidMountBodyArray[j].trim();

      //     if (currentUpdateLine === currentMountLine) {
      //       updatedMountBody.push(currentMountLine);
      //     }
      //   }
      // }

      if (componentDidMountBodyArray.length === 0) {
        return -1;
      } else {
        bodyMountLineArray = bodyMountLineArray.map((line) => {
          if (componentDidMountBodyArray.indexOf(line) === -1) {
            return line;
          }
        });

        if (bodyMountLineArray[0] !== undefined) {
          object['componentDidMount()'] =
            'componentDidMount() {\n' +
            `   ${bodyMountLineArray.join(' ')}` +
            '  }';
        } else {
          delete object['componentDidMount()'];
        }
        return object;
      }
    }
  }
}

//Creates routes for creating useEffects
function createUseEffects(objectOfLifeCycle) {
  const objectOfLifeCycleKeys = Object.keys(objectOfLifeCycle);

  if (objectOfLifeCycleKeys.length === 1) {
    let useEffect = createSingleUseEffect(
      objectOfLifeCycle[objectOfLifeCycleKeys[0]],
      objectOfLifeCycleKeys[0]
    );
    return useEffect;
  } else {
    const similarities = checkMountAndUpdateForSimilarties(objectOfLifeCycle);
    if (similarities === -1) {
      return multiuseEffectCreate(objectOfLifeCycle);
    } else {
      return multiuseEffectCreate(similarities);
    }
  }
}

module.exports = {
  findComponents,
  createSingleUseEffect,
  createUseEffects,
};
