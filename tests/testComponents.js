const test1 = `class App extends Component {

  render() {
    return <div></div>
  }
}`

const answer1 = `import React from "react"
function App() {
  return <div></div>
}
`
const test2 = `class App extends Component {
  constructor() {
    super()
    this.state = {
      firstName: 'Dan',
    }
  }

  render() {
    return (
      <div className="simple">
      </div>
    )
  }
}`

const answer2 = `import React, { useState } from "react"
function App() {
  const [firstName, setFirstName] = useState("Dan")

  return <div className="simple"></div>
}
`
const test3 = `class App extends Component {
  constructor() {
    super()
    this.state = {
      firstName: 'Dan',
    }
  }
  genericMethod() {
    const x = 1 + 2
  }
  render() {
    return <div></div>
  }
}`

const answer3 = `import React, { useState } from "react"
function App() {
  const [firstName, setFirstName] = useState("Dan")

  function genericMethod() {
    const x = 1 + 2
  }

  return <div></div>
}
`
const test4 = `import React, { Component } from 'react'
class App extends Component {
  constructor() {
    super()
    this.state = {
      firstName: 'Dan',
    }
  }
  genericMethod() {
    const x = 1 + 2
  }
  render() {
    return <div></div>
  }
}
`
const answer4 = `import React, { useState } from "react"

function App() {
  const [firstName, setFirstName] = useState("Dan")

  function genericMethod() {
    const x = 1 + 2
  }

  return <div></div>
}
`

const test5 = `import React, { Component } from 'react'
class App extends Component {
  constructor() {
    super()
    this.state = {
      firstName: 'bobdog',
      lastName: 'snob',
      friends: ['joe', 'shmoe'],
      cats: { lstName: 'woof' },
      kangaroo: {
        2: 3,
        name: 'Jacki',
      },
    }
  }
  genericMethod() {
    const x = 1 + 2
  }
  render() {
    return <div></div>
  }
}
`
const answer5 = `import React, { useState } from "react"

function App() {
  const [firstName, setFirstName] = useState("bobdog")
  const [lastName, setLastName] = useState("snob")
  const [friends, setFriends] = useState(["joe", "shmoe"])
  const [cats, setCats] = useState({ lstName: "woof" })
  const [kangaroo, setKangaroo] = useState({
    2: 3,
    name: "Jacki",
  })

  function genericMethod() {
    const x = 1 + 2
  }

  return <div></div>
}
`

const test6 = `import React, { Component } from 'react'
class App extends Component {
  constructor() {
    super()
    this.state = {
      firstName: 'bobdog',
      lastName: 'snob',
      friends: ['joe', 'shmoe'],
      cats: { lstName: 'woof' },
      kangaroo: {
        2: 3,
        name: 'Jacki',
      },
    }
  }
  genericMethod() {
    const x = 1 + 2
  }
  genericMethod2 = () => {
    const dullVariable = 24
    this.setState({
      lastName: 'wowow',
    })
  }
  render() {
    return <div></div>
  }
}
`
const answer6 = `import React, { useState } from "react"

function App() {
  const [firstName, setFirstName] = useState("bobdog")
  const [lastName, setLastName] = useState("snob")
  const [friends, setFriends] = useState(["joe", "shmoe"])
  const [cats, setCats] = useState({ lstName: "woof" })
  const [kangaroo, setKangaroo] = useState({
    2: 3,
    name: "Jacki",
  })

  function genericMethod() {
    const x = 1 + 2
  }
  function genericMethod2() {
    const dullVariable = 24
    setLastName("wowow")
  }

  return <div></div>
}
`

const test = ``
const answer = ``

module.exports = {
  test1,
  answer1,
  test2,
  answer2,
  test3,
  answer3,
  test4,
  answer4,
  test5,
  answer5,
  test6,
  answer6,
}
