let str = `class testApp extends Component {
  render() {
    return <div>hi</div>;
  }
}`;

function translate(string) {}

/*

expected output:

function testApp() {
  return (
    <div>hi</div>
  )
}

*/

console.log(translate(str));
