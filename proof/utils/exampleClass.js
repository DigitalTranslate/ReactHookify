const str0 = `import statement

class    testApp extends Component {

  constructor() {
    super()
    this.state = {
      counter: 0,
      open: false,
      closed: true
    }
  }

  componentDidMount() {

  }

  genericMethod2     () {

  }

  genericMethod() {

  }

  render() {
    return <div>{array[1]}</div>
  }
}
export something
`;

let str1 = `
import react from 'react'
class TestApp extends Component {
  constructor() {
    super()
  }
  genericMethod1() {
  }
  genericMethod2() {
  }
  render() {
    const hello = [];
    const thing = this.props.thing
    return <div>{array[1]}</div>
  }
}
export default TestApp
`;
let str2 = `import statement
class    testApp extends Component {
  render() {
    return <div>{array[1]}</div>
  }
}
export something
`;
let str3 = `
import react from 'react'
class TestApp extends Component {
  render() {
    const hello = [];
    const thing = this.props.thing
    return <div>{array[1]}</div>
  }
}
export default TestApp
`;

module.exports = {
  str0,
  str1,
  str2,
  str3,
};
