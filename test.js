/* eslint-disable react/self-closing-comp */
/* eslint-disable react/button-has-type */
import React, { Component } from 'react';

export default class test extends Component {
  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button
          onClick={function () {
            this.setState({
              count: this.state.count + 1,
              name: this.state.name,
            });
          }}
        >
          Click me
        </button>
        <button
          onClick={() =>
            this.setState({
              count: this.state.count + 1,
              name: this.state.name,
            })
          }
        ></button>
      </div>
    );
  }
}
