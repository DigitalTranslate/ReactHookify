// Try out our test component below, or write your own!
import React, { Component } from 'react'

export default class Test extends Component {
  constructor() {
    super()
    this.state = {
      firstName: 'Bob',
      lastName: 'Smith',
    }
  }
  handleChange(event) {
    event.preventDefault()
    this.setState({
      [event.target.name]: event.target.value,
      currentFrame: event.target.value,
    })
  }
  render() {
    return (
      <div>
        <div>
          Hello {this.state.firstName} {this.state.lastName}!
        </div>
        <button
          type="button"
          onClick={() => {
            this.setState({
              firstName: 'Tom',
              lastName: 'Hanks',
            })
          }}
        >
          Change State!
        </button>
      </div>
    )
  }
}
