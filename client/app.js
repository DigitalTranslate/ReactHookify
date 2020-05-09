import React, { Component } from 'react'
export default class App extends Component {
  constructor() {
    super()
    this.state = {
      firstName: 'bob, dog',

      lastName: 'snob',

      friends: ['joe', 'shmoe'],
    }
  }

  componentDidMount() {
    document.title = this.state.firstName
  }

  otherGenericMethod2() {
    const excitingVariable = 23
    console.log('hello world')
  }

  genericMethod() {
    const dullVariable = 24
    console.log('hi world')
  }

  render() {
    return (
      <div className="simple">
        <div>hi</div>
      </div>
    )
  }
}
