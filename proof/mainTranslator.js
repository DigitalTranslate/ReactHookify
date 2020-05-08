/* eslint-disable no-path-concat */

const { str0, str1, str2, str3 } = require('./utils/exampleClass');
const { handleConstructor } = require('./utils/constructorUtil');
const fs = require('fs');
const {
  hookifyPath,
  getBodyMethods,
  getBody,
  getEndIdxOfFunc,
  getInsideOfFunc,
  getClassName,
  getClassCompIdx,
} = require('./utils/commonUtils');
const { getBeforeReturn } = require('./utils/renderUtil');
const { yellow } = require('chalk');

//THIS FUNCTION IS IN CHARGE OF TRANSLATING CLASS COMPONENT TO FUNCTIONAL COMPONENT && PUTS IT ALL TOGETHER
function translateToFunctionComp(fileInString) {
  const classCompIdx = getClassCompIdx(fileInString);
  const beforeClass = fileInString.slice(0, classCompIdx);
  const nameOfClass = getClassName(fileInString, classCompIdx);
  //checks whole class string from 'props'
  const propsCheck = fileInString.includes('props') ? 'props' : '';
  let startOfBodyIdx = fileInString.indexOf('{') + 1;

  //CONSTRUCTOR
  const constructorCheck = /(constructor)[ ]*\(/.test(fileInString);
  let handledConstructor = '';

  if (constructorCheck) {
    handledConstructor = handleConstructor(fileInString);
    startOfBodyIdx = getEndIdxOfFunc(fileInString, 'constructor');
  }

  //BODY
  let body = getBody(fileInString, startOfBodyIdx);

  let funcs = [];
  getBodyMethods(funcs, body);

  const funcCheck = funcs.length ? true : false;

  //RETURN STATEMENT
  const beforeReturn = getBeforeReturn(fileInString);
  const returnSlice = getInsideOfFunc(fileInString, 'render');

  //FINAL TEMPLATE
  let finalStr = `
  ${beforeClass}
  function ${nameOfClass}(${propsCheck}) {
    ${handledConstructor}
    ${funcCheck ? `\n${funcs.join('\n')}\n` : ''}
    ${beforeReturn}
    return (
      ${returnSlice}
    )
  }`;
  return finalStr.replace(/this.props/gi, 'props');
}

//THIS FUNCTION TAKES CREATED STRING AND WRITES A FILE
function createFunctionComponentFile(funcCompInStr, filepath) {
  const newPath = hookifyPath(filepath);

  fs.writeFile(newPath, funcCompInStr, (err, contents) => {
    //creates proof.js in proof directory
    if (err) throw err;
    console.log(yellow('Made proof.js'));
  });
}

//THIS FUNCTION TAKES FILEPATH, READS FILE AT PATH AND THEN CREATES
//FUNCTIONAL COMPONENT EQUIVALENT
async function readAndCreate(filepath) {
  const content = await fs.promises.readFile(filepath, 'utf-8');
  //DO NOTE USE readFileSync
  const funcComponent = translateToFunctionComp(content);
  createFunctionComponentFile(funcComponent, filepath);
}

//TESTING WITH READING A FILE && CAN DO WITH CLI NOW
// readAndCreate(__dirname + '/../client/app.js')

//TESTING WITHOUT READING FILE
const finalStr = translateToFunctionComp(str0); //change which string to test
// createFunctionComponentFile(finalStr, '/client/proof.js')

module.exports = {
  readAndCreate,
};
