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
}`

let str2.1 = `componentWillUnMount() {
  const data = axios.get('/api/users${this.state.name}')
}`

let effects = {
  name: {
    variables: [name, x],
    lines: [
      {
        value: 'const x = this.state.name',
        lifeCycles: ['ComponentDidMount', 'ComponentDidUpdate'],
        withinIfStatement: 'N',
      },
      {
        value: 'const x = this.state.name',
        lifeCycles: ['ComponentDidMount', 'ComponentDidUpdate'],
        withinIfStatement: 'N',
      },
    ],
  },
}
