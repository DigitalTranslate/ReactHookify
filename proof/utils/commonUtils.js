/* eslint-disable no-lonely-if */
function getClassName(string) {
  const classIdx = string.indexOf('class');
  const classSlice = string.slice(classIdx);
  const nameOfClass = classSlice.split(/[ ]+/)[1];
  return nameOfClass;
}

function validBraces(braces) {
  let matches = { '(': ')', '{': '}', '[': ']' };
  let stack = [];
  let currentChar;
  for (let i = 0; i < braces.length; i++) {
    currentChar = braces[i];
    if ('(){}[]'.includes(currentChar)) {
      if (matches[currentChar]) {
        // opening braces
        stack.push(currentChar);
      } else {
        // closing braces
        if (currentChar !== matches[stack.pop()]) {
          return false;
        }
      }
    }
  }
  return stack.length === 0; // any unclosed braces left?
}

function getInsideOfFunc(string, methodStr) {
  let startIdx = string.indexOf(methodStr);
  if (startIdx === -1) return;
  startIdx = string.indexOf('{', startIdx);
  let endIdx = startIdx + 1;

  let funcSlice = string.slice(startIdx, endIdx);
  while (!validBraces(funcSlice)) {
    endIdx++;
    funcSlice = string.slice(startIdx, endIdx);
  }
  if (funcSlice.indexOf('return') > -1) {
    return funcSlice
      .slice(funcSlice.indexOf('return') + 6, funcSlice.length - 2)
      .trim();
  } else {
    return funcSlice.slice(1, funcSlice.length - 2);
  }
}
function getEndIdxOfFunc(string, methodStr) {
  let startIdx = string.indexOf(methodStr);
  if (startIdx === undefined) return;
  startIdx = string.indexOf('{', startIdx);
  let endIdx = startIdx + 1;
  let funcSlice = string.slice(startIdx, endIdx);
  while (!validBraces(funcSlice)) {
    endIdx++;
    funcSlice = string.slice(startIdx, endIdx);
  }
  return endIdx;
}
function getBody(string, startIdx) {
  let endIdx = getEndIdxOfFunc(string, 'Component') - 1; // add in React.Component Logic
  return string.slice(startIdx, endIdx).trim();
}

function getBodyMethods(funcs, bodyStr) {
  // find first non-white space (aka function starting index)
  let nonWhiteSpaceIdx = bodyStr.search(/\S/);
  if (nonWhiteSpaceIdx === -1) {
    return;
  }
  let newBody = bodyStr.substring(nonWhiteSpaceIdx);
  let funcEndIdx = newBody.search(/[^a-zA-Z0-9_]/); // find function name ending index
  let funcName = newBody.slice(0, funcEndIdx);
  let inside = getInsideOfFunc(bodyStr, `${funcName}`);
  let endOfFuncIdx = getEndIdxOfFunc(bodyStr, `${funcName}`);
  newBody = bodyStr.substring(endOfFuncIdx);

  let funcStringified = `function ${funcName}() {
      ${inside}
    }`;
  if (funcName.toLowerCase() !== 'render') {
    funcs.push(funcStringified);
  }
  getBodyMethods(funcs, newBody);
}

module.exports = {
  getBodyMethods,
  getBody,
  getEndIdxOfFunc,
  getInsideOfFunc,
  validBraces,
  getClassName,
};
