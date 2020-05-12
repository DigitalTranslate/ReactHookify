/* eslint-disable complexity */
/* eslint-disable max-statements */
const { getInsideOfFunc } = require('./utils/commonUtils')
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

let test = `componentDidMount() {
  const x = this.state.name
  const data = axios.get('/api/users/x')
  let y = this.state.friends
  const data2 = axios.get('/api/users/y)
  const apiSubscribe = api.subscribe()
}`

let effects = {
  noEffect: {
    statements: [],
  },
}

const parser = (string) => {
  const lifeCycleMethodName = string.slice(0, string.indexOf('('))
  let hookArray
  if (lifeCycleMethodName === 'ComponentDidMount') {
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
    newString = newString.substring(reassignedStateArr.index + 1)
  }

  // while loop to cut/paste each line/statement into their appropriate effect
  // ADD IN VALID BRACES
  newString = getInsideOfFunc(string, lifeCycleMethodName).trim()
  const effectsArr = Object.keys(effects)

  let counter = 0
  while (/*counter < 4*/ newString.length) {
    let newStatement = newString.slice(0, newString.indexOf('\n'))
    // console.log('newStatement', newStatement)
    if (newString.indexOf('\n') === -1) {
      newString = ''
    } else {
      newString = newString.substring(newString.indexOf('\n') + 2) // might need to be +1?
    }

    let noEffect = true
    for (let i = 0; i < effectsArr; i++) {
      let currentEffectVar = effectsArr[i]
      for (let j = 0; j < currentEffectVar.variables.length; j++) {
        //regex search to match statement to effect
        let currentVar = currentEffectVar.variables[j]
        let regex = new RegExp(`([^a-z0-9])(${currentVar})([^a-z0-9])`)
        console.log('regex', regex)
        if (newStatement.search(regex) > -1) {
          console.log('in if')
          noEffect = false
          effects[currentEffectVar].statements.push({
            text: newStatement,
            lifecycle: lifeCycleMethodName,
            hookArray: hookArray,
          })
        }
      }
    }
    // if (noEffect) {
    //   effects.noEffect.
    // }
    counter++
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

parser(test)
console.log('effects', effects)
