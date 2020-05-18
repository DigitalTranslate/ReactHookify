const test1 = `class App extends Component {
  constructor() {
    super()
    this.state = {
      firstName: 'bobdog',
    }
  }

  render() {
    return (
      <div className="simple">
      </div>
    )
  }
}`

const answer1 = `import React, { useState } from "react"
function App() {
  const [firstName, setFirstName] = useState("bobdog")

  return <div className="simple"></div>
}
`

module.exports = { test1, answer1 }
