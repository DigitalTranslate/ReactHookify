let str = `class testApp extends Component {
  render() {
    return <div>hi</div>;
  }
}`;

const classToFunctionTemp = `function ${name}()`;

function translate(string) {
  const stringArray = string.slice();
}

function classToFunctionTemp(string) {}

/*

expected output:

function testApp() {
  return (
    <div>hi</div>
  )
}

*/

console.log(translate(str));
