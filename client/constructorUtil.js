const { getInsideOfFunc } = require('./test2')
const fs = require('fs')

let exampleClass = `import statement

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
    stuff
  }

  render() {
    return <div>{array[1]}</div>;
  }
}
export something
`

function handleConstructor(fullClassStr) {
  const constructorInside = getInsideOfFunc(fullClassStr, 'constructor')
  const stateInsides = getInsideOfFunc(constructorInside, 'this.state')
  const arrOfStates = stateInsides
    .split(',')
    .map((singleState) => singleState.trim().split(':'))
  //arrOfStates = [ [ 'counter', ' 0' ], [ 'open', ' false' ], [ 'closed', ' true' ] ]
  return arrOfStates
    .map(
      (singleState) =>
        `const [${singleState[0]}, set${
          singleState[0]
        }] = useState(${singleState[1].trim()})`
    )
    .join('\n')
}

// TEST FOR WRITING FILE
fs.writeFile('proof.js', handleConstructor(exampleClass), (err) => {
  if (err) throw err
  console.log('done')
})
