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

function getIfConditional(string, methodStr) {
  let ifIndex = string.indexOf(methodStr);
  let startIdx = string.indexOf(methodStr);
  startIdx = string.indexOf('{', startIdx);
  let endIdx = startIdx + 1;
  let funcSlice = string.slice(startIdx, endIdx);

  while (!validBraces(funcSlice)) {
    endIdx++;
    funcSlice = string.slice(ifIndex, endIdx);
  }

  return funcSlice;
}

module.exports = {
  getInsideOfFunc,
  validBraces,
  getIfConditional,
};
