/* eslint-disable no-lonely-if */
let str = `
import react from 'react'

class TestApp extends Component {

  render() {
    const hello = [];
    const thing = this.props.thing
    return <div>{array[1]}</div>;
  }
}

export default TestApp
`;

function translate(string) {
  const nameOfClass = getClassName(string);
  const propsCheck = string.includes('props') ? 'props' : '';
  const beforeReturn = getBeforeReturn(string);
  const returnSlice = getReturn(string);

  let finalStr = `function ${nameOfClass}(${propsCheck}) {
    ${beforeReturn}
    return (
      ${returnSlice}
    )
  }`;

  return finalStr.replace(/this./gi, '');
}

/*

expected output:

function testApp() {
  return (
    <div>hi</div>
  )
}

*/

console.log(translate(str));

function getClassName(string) {
  const classIdx = string.indexOf('class');
  const classSlice = string.slice(classIdx);
  const nameOfClass = classSlice.split(/[ ]+/)[1];
  return nameOfClass;
}

function getBeforeReturn(string) {
  let renderIdx = string.indexOf('render');
  renderIdx = string.indexOf('{', renderIdx);

  let middle = string
    .slice(renderIdx + 1, string.indexOf('return', renderIdx))
    .trim();

  return middle;
}

function getReturn(string) {
  let renderIdx = string.indexOf('render');
  renderIdx = string.indexOf('{', renderIdx);

  let renderEndIdx = renderIdx + 1;
  let returnSlice = string.slice(renderIdx, renderEndIdx);
  while (!validBraces(returnSlice)) {
    renderEndIdx++;
    returnSlice = string.slice(renderIdx, renderEndIdx);
  }
  returnSlice = returnSlice
    .slice(returnSlice.indexOf('return') + 6, returnSlice.length - 2)
    .trim();
  return returnSlice;
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
