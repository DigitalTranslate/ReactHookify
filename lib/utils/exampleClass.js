const str0 = `import statement

class    testApp extends React.Component {

  constructor() {
    super()
    this.state = {
      counter: 0,
      open: false,
      closed: true
    }
  }

  componentDidMount(arg1) {

  }

  // comment 1

  ANOTHERgenericMethod(arg2) {

  }

  /* comment 2 */

  genericMethod  () {

  }
  genericMethod2  () {

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

let str4 = `import statement

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
    console.log("start")
  }

  componentDidUpdate(prevState, prevProps) {
    if(prevState.counter !== this.state.counter){
      console.log("counter")
    }

    if(prevProps.counter2 !== this.props.counter2){
      console.log("counter Props")
    }
    console.log("outside")
  }

  componentWillUnmount() {
    console.log("end")
    console.log("end take two")
  }
  

  render() {
    return <div>{array[1]}</div>
  }
}
export something
`;

module.exports = {
  str0,
  str1,
  str2,
  str3,
  str4,
};
