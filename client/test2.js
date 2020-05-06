/* eslint-disable no-lonely-if */
let str = `import statement

class    testApp extends Component {

  componentDidMount() {
    props.arry[i]
    obj = {}
  }

  render() {
    const array = [1]
    const hello = this.props.hello
    return <div>hi</div>;
  }
}
export something
`;

function translate(string) {
  const classIdx = string.indexOf('class');
  const classSlice = string.slice(classIdx);
  const nameOfClass = classSlice.split(/[ ]+/)[1];

  let renderIdx = string.indexOf('render');
  renderIdx = string.indexOf('{', renderIdx);
  let renderEndIdx = renderIdx + 1;
  let renderSlice = string.slice(renderIdx, renderEndIdx);
  while (!validBraces(renderSlice)) {
    renderEndIdx++;
    renderSlice = string.slice(renderIdx, renderEndIdx);
  }
  renderSlice = renderSlice
    .slice(renderSlice.indexOf('return') + 6, renderSlice.length - 2)
    .trim();

  return `function ${nameOfClass} {
    return (
      ${renderSlice}
    )
  }`;
}

/*

expected output:

function testApp(props) {
  const array = [1]
  hello = this.props
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
