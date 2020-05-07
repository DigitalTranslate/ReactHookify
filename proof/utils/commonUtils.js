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
  // let startIdx = string.indexOf(methodStr);
  let startIdx = funcNameStartIdx(string, methodStr);
  startIdx = string.indexOf('{', startIdx);
  let endIdx = startIdx + 1;
  let funcSlice = string.slice(startIdx, endIdx);
  while (!validBraces(funcSlice)) {
    endIdx++;
    funcSlice = string.slice(startIdx, endIdx);
  }
  funcSlice = funcSlice
    .slice(funcSlice.indexOf('return') + 6, funcSlice.length - 2)
    .trim();
  return funcSlice;
}
function getEndIdxOfFunc(string, methodStr) {
  // let startIdx = string.indexOf(methodStr);
  let startIdx = funcNameStartIdx(string, methodStr);
  startIdx = string.indexOf('{', startIdx);
  let endIdx = startIdx + 1;
  let funcSlice = string.slice(startIdx, endIdx);
  while (!validBraces(funcSlice)) {
    endIdx++;
    funcSlice = string.slice(startIdx, endIdx);
  }
  return endIdx;
}
function getBetween(string, startIdx) {
  return string.slice(startIdx, string.indexOf('render')).trim();
}

function getBody(funcs, pointer, bodyStr) {
  while (pointer < bodyStr.length) {
    let parenIdx = bodyStr.indexOf('(', pointer);
    let funcStartIdx = pointer;
    while (bodyStr[funcStartIdx] === ' ' || bodyStr[funcStartIdx] === '\n') {
      funcStartIdx++;
    }
    let funcName = bodyStr.slice(funcStartIdx, parenIdx);
    let inside = getInsideOfFunc(bodyStr, `${funcName}`);
    pointer = getEndIdxOfFunc(bodyStr, `${funcName}`);
    let FuncStringified = `function ${funcName.trim()}() {
      ${inside}
    }`;
    funcs.push(FuncStringified);
  }
}

function funcNameStartIdx(string, methodStr) {
  console.log(string);
  console.log(methodStr);
  let startIdx = string.indexOf(methodStr);
  let endIdx = minBesidesNegOne(
    string.indexOf('(', startIdx),
    string.indexOf(' ', startIdx)
  );
  console.log('startIdx', startIdx);
  console.log('endIdx', endIdx);
  console.log('sliced', string.slice(startIdx, endIdx));
  console.log(string.slice(startIdx, endIdx).trim() === methodStr.trim());
  while (string.slice(startIdx, endIdx) !== methodStr.trim()) {
    startIdx = string.indexOf(methodStr, endIdx);
    endIdx = minBesidesNegOne(
      string.indexOf('(', startIdx),
      string.indexOf(' ', startIdx)
    );
  }
  return startIdx;
}

function minBesidesNegOne(num1, num2) {
  if (num1 === -1) {
    return num2;
  } else if (num2 === -1) {
    return num1;
  } else {
    return Math.min(num1, num2);
  }
}

module.exports = {
  getBody,
  getBetween,
  getEndIdxOfFunc,
  getInsideOfFunc,
  validBraces,
  getClassName,
};
