/* eslint-disable max-statements */
/* eslint-disable no-path-concat */

const { handleConstructor } = require('./utils/constructorUtil');
const {
  mainGenericFunction,
  filterGenericMethods,
} = require('./utils/LifeCycleMain/genericMethods');
const { readClassCompDetails } = require('./utils/translateUtils');
const {
  getUseEffects,
  handleAsync,
} = require('./utils/LifeCycleMain/lifecycleUtils');
const {
  getBody,
  replaceSetState,
  parseReactImport,
  extractControlledFormMethodNames,
} = require('./utils/commonUtils');
const { handleRender } = require('./utils/renderUtil');

//THIS FUNCTION IS IN CHARGE OF TRANSLATING CLASS COMPONENT TO FUNCTIONAL COMPONENT && PUTS IT ALL TOGETHER
function translateToFunctionComp(fileInString) {
  // Class name and start of Component
  const classDetails = readClassCompDetails(fileInString);

  //CONSTRUCTOR
  const handledConstructor = handleConstructor(classDetails);

  //BODY
  let { body, genericMethods } = getBody(classDetails);

  //LIFE CYCLE METHODS
  let arrOfUseEffects = getUseEffects(body);

  const addGenericFunction = mainGenericFunction(
    genericMethods,
    body,
    arrOfUseEffects
  );

  const filteredGenericMethods = filterGenericMethods(
    genericMethods,
    addGenericFunction.genericMethods
  );

  genericMethods = filteredGenericMethods;

  arrOfUseEffects = addGenericFunction.useEffects;

  //RENDER
  let handledRender = handleRender(classDetails);

  //MODIFICATIONS
  classDetails.beforeClass = parseReactImport(
    classDetails,
    arrOfUseEffects,
    handledConstructor
  );
  handledRender = extractControlledFormMethodNames(
    genericMethods,
    handledRender
  );
  handleAsync(arrOfUseEffects);

  const { beforeClass, nameOfClass, propsCheck, afterClass } = classDetails;

  //FINAL TEMPLATE
  const finalStr = `
  ${beforeClass}
  function ${nameOfClass}(${propsCheck}) {
    ${handledConstructor}
    ${`\n${arrOfUseEffects.join('\n')}\n`}
    ${`\n${genericMethods.join('\n')}\n`}
    ${handledRender}
  }
  ${afterClass}`;
  return replaceSetState(finalStr)
    .replace(/this\.props/gi, 'props')
    .replace(/this\.state\./gi, '')
    .replace(/(?<!\/\*)this\./gi, '');
}

/*
TESTING
*/

//TESTING WITH READING A FILE && CAN DO WITH CLI NOW
// readAndCreate(__dirname + '/../client/app.js')

//TESTING WITHOUT READING FILE
// const finalStr = translateToFunctionComp(str0) //change which string to test
// createFunctionComponentFile(finalStr, '/client/proof.js')

module.exports = translateToFunctionComp;
