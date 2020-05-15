/* eslint-disable complexity */
/* eslint-disable max-statements */
const { getInsideOfFunc, getEndIdxOfBraces } = require('./utils/commonUtils')
/*

let str1 = `componentDidMount() {
  const data = axios.get('/api/users${this.state.name}')
}`
let str1.1 = `componentDidUnMount() {
  const data = axios.get('/api/users${this.state.name}')
}`


let str2 = `componentDidMount() {
  const x = this.state.name
  const data = axios.get('/api/users/x')
  let y = this.state.friends
  const data2 = axios.get('/api/users/y)
  let z = this.state.firstName + this.state.lastName
  const data = axios.get('/api/users/z)
}`

let str2.1 = `componentWillUnMount() {
  const data = axios.get('/api/users${this.state.name}')
}`

let test2 = [`componentDidMount() {
  const x = this.state.name
  const data = axios.get('/api/users/x')
  let y = this.state.friends
  const data2 = axios.get('/api/users/y)`, `componentDidUpdate() {
    const x = this.state.name
    const data = axios.get('/api/users/x')
    let y = this.state.friends
    const data2 = axios.get('/api/users/y)`]





let effectsExamples = {
  name: {
    variables: [name, x],
    statements: [ // denoted by a newline or valid braces?
      {
        value: 'const x = this.state.name',
        lifeCycles: ['ComponentDidMount',],
        hookArray: [],
        // cleanup: false
      },
      {
        value: 'const data = axios.get("/api/users/x")',
        lifeCycles: ['ComponentDidMount'],
        hookArray: [],
        // cleanup: false
      },
    ],
  },
  friends: {
    variables: [friends, y],
    statements: [ // denoted by a newline or valid braces?
      {
        value: 'const y = this.state.friends',
        lifeCycles: ['ComponentDidMount',],
        hookArray: [],
        // cleanup: false
      },
      {
        value: 'const y = this.state.friends',
        lifeCycles: ['ComponentDidUpdate',],
        hookArray: null,
        // cleanup: false
      },
      {
        value: 'const data = axios.get("/api/users/y")',
        lifeCycles: ['ComponentDidUpdate'],
        hookArray: [friends],
        // cleanup: false
      },
    ],
  },
  noEffect: {
    variables: [],
    statements: [ // denoted by a newline or valid braces?
      {
        value: 'const y = this.state.friends',
        lifeCycles: ['ComponentDidMount',],
        hookArray: [],
        // cleanup: false
      },
      {
        value: 'const y = this.state.friends',
        lifeCycles: ['ComponentDidUpdate',],
        hookArray: null,
        // cleanup: false
      },
      {
        value: 'const data = axios.get("/api/users/y")',
        lifeCycles: ['ComponentDidUpdate'],
        hookArray: [friends],
        // cleanup: false
      },
    ],
  }
}
*/

// componentDidUpdate(prevProps, prevState) {
//   if (prevState.count !== this.state.count) {
//     document.title = `You clicked ${this.state.count} times`;
//   }
// }

// useEffect(() => {
//   document.title = `You clicked ${count} times`;
// }, [count]); // Only re-run the effect if count changes

// statements can be separated by \n or valid braces

// ['name', 'x']
// [ 'friends', 'y' ]

let effects = {}

const parser = (string) => {
  const lifeCycleMethodName = string.slice(0, string.indexOf('('))
  let hookArray
  if (lifeCycleMethodName === 'componentDidMount') {
    hookArray = []
  }

  // while loop to find all of the effects
  let newString = string
  while (newString.search(/(this\.state\.)([a-z]+)/i) > -1) {
    let matchedArr = newString.match(/(this\.state\.)([a-z]+)/i) // Ex: this.state.name
    let newEffect = matchedArr[2]
    if (!effects[newEffect]) {
      effects[newEffect] = {}
      effects[newEffect].variables = [newEffect]
      effects[newEffect].statements = []
    }
    newString = newString.substring(matchedArr.index + 1)
  }

  // while loop to find all reassignments of effects
  newString = string
  while (
    newString.search(
      /([a-z0-9_]+)([^a-z]*)(=)([^=]*)(this\.state\.)([a-z]+)/i // x = this.state.name
    ) > -1
  ) {
    let reassignedStateArr = newString.match(
      /([a-z0-9_]+)([^a-z]*)(=)([^=]*)(this\.state\.)([a-z]+)/i
    ) // Ex: x = this.state.name (matches whole string, first element is 'x')
    let effect = reassignedStateArr[6]
    let newVar = reassignedStateArr[1]
    effects[effect].variables.push(newVar)
    newString = newString.substring(
      reassignedStateArr.index + reassignedStateArr[0].length
    )
  }

  // while loop to cut/paste each line/statement into their appropriate effect
  // ADD IN VALID BRACES
  newString = getInsideOfFunc(string, lifeCycleMethodName).trim()
  const effectsArr = Object.keys(effects)

  /*
  let test5 = `componentDidMount() {
  document.title = 'You clicked {this.state.count} times';
}`
  */

  while (newString.length) {
    let newStatement
    if (newString.indexOf('\n') === -1) {
      newStatement = newString
      newString = ''
    } else {
      // if valid braces is true (or no braces) then we look for newline. If valid braces is false, then we need the index of the close brace
      let newLineIdx = newString.indexOf('\n')
      newStatement = newString.slice(0, newString.indexOf('\n'))
      if (newStatement.search(/[{[(]/) > -1) {
        let endIdx = getEndIdxOfBraces(newString)
        // console.log('endLineIdx', endIdx)
        if (endIdx > newLineIdx) {
          // console.log('entering if')
          if (!newString.indexOf('\n', endIdx) === -1) {
            endIdx = newString.indexOf('\n', endIdx)
          }
          newStatement = newString.slice(0, endIdx)
        }
      }
      newString = newString.substring(newStatement.length + 2) // might need to be +1?
    }

    let noEffectTest = true
    for (let i = 0; i < effectsArr.length; i++) {
      let currentEffectVar = effectsArr[i]
      for (let j = 0; j < effects[currentEffectVar].variables.length; j++) {
        //regex search to match statement to effect
        let currentVar = effects[currentEffectVar].variables[j]
        let regex = new RegExp(`([^a-z0-9])(${currentVar})([^a-z0-9])`)
        if (newStatement.search(regex) > -1) {
          noEffectTest = false
          effects[currentEffectVar].statements.push({
            text: newStatement,
            lifecycle: lifeCycleMethodName,
            hookArray: hookArray,
          })
          break
        }
      }
    }

    if (!effects.noEffect) {
      effects.noEffect = {
        variables: [],
        statements: [],
      }
    }
    if (noEffectTest) {
      effects.noEffect.statements.push({
        text: newStatement.trim(),
        lifecycle: lifeCycleMethodName,
        hookArray: hookArray,
      })
    }
  }
}

/*
effects: {
  name: { variables: [ 'name', 'x' ], statements: [] },
  friends: { variables: [ 'friends', 'y' ], statements: [] }
}

value: 'const y = this.state.friends',
lifeCycles: ['ComponentDidMount',],
hookArray: [],
 // cleanup: false

*/

let test = `componentDidMount() {
  const x = this.state.name
  const data = axios.get('/api/users/x')
  let y = this.state.friends
  const data2 = axios.get('/api/users/y)
  const apiSubscribe = api.subscribe()
  const hello = 'hi'
}`

let test1 = `componentDidMount() {
  const data = axios.get('/api/users/this.state.name')
  const data2 = axios.get('/api/users/this.state.friends')
}`

let test2 = `componentDidMount() {
  axios.get('/api/this.state.name')
  let obj = {
    prop1: 'hi',
    friends: this.state.friends
    pro2: []
  }
  let obj2 = {
    prerge: 'wtbwb',
  }
}`

let test3 = `componentDidMount() {
  this.chart = c3.generate({
    bindto: ReactDOM.findDOMNode(this.refs.chart),
    data: {
      columns: [
        ['data1', 30, 200, 100, 400, 150, 250],
        ['data2', 50, 20, 10, 40, 15, 25]
      ]
    }
  });
}`

let test4 = `componentDidMount() {
  this.setState({
    firstName: this.props.user.firstName || '',
    lastName: this.props.user.lastName || '',
    address: this.props.user.address || '',
    email: this.props.user.email || '',
  })
}`

let test5 = `componentDidMount() {
  document.title = 'You clicked {this.state.count} times'
  ChatAPI.subscribeToFriendStatus(
    this.props.friend.id,
    this.handleStatusChange
  )
}`

let test6 = `componentDidMount() {
  document.title = 'You clicked {this.state.count} times';
}`

parser(test5)
console.log('effects', effects)
// console.log('name statements', effects.name.statements)
// console.log('friends statements', effects.friends.statements)
console.log('count statements', effects.count.statements)
console.log('noEffect statements', effects.noEffect.statements)

// console.log(effects.friends.statements[0].text)
