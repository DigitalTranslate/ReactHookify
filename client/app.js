/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
export default class App extends Component {
  constructor() {
    super();
    this.state = {
      firstName: 'bobdog',
      lastName: 'snob',
      friends: ['joe', 'shmoe'],
      cats: { lstName: 'woof' },
      kangaroo: {
        2: 3,
        name: 'Jacki',
      },
    };
  }

  componentDidMount() {
    genericMethodTest();
    otherGenericMethod2();
    genericMethod();
  }

  componentDidUpdate(prevProps) {
    genericMethodTest();
    if (prevProps.counter !== this.props.counter) {
      genericMethodTest();
      document.tile = this.state.title;
    }
    if (prevState.counter2 !== this.state.counter2) {
      genericMethodTest();
    }
  }

  otherGenericMethod2 = () => {
    const excitingVariable = 23;
    this.setState({
      firstName: 'catmeow',
    });
  };

  genericMethod = () => {
    const dullVariable = 24;
    this.setState({
      lastName: 'wowow',
    });
  };

  genericMethodTest = () => {
    const dullVariable = 24;
    this.setState({
      lastName: 'wowow',
    });
  };

  render() {
    const x = this.state.firstName;
    return (
      <div className="simple">
        <div>hi</div>
        <button
          type="button"
          onClick={async function () {
            await this.setState({
              count: this.state.count + 1,
              name: this.state.name,
            });
          }}
        >
          Click me
        </button>
        <button
          type="button"
          onClick={() =>
            this.setState({
              count: this.state.count + 2,
              name: this.state.name,
            })
          }
        >
          Click Me
        </button>
        <button
          type="button"
          onClick={() =>
            this.setState({
              count: this.state.count + 3,
              name: this.state.name,
            })
          }
        >
          Click Me
        </button>
        <button
          type="button"
          onClick={() =>
            this.setState({
              count: this.state.count + 4,
              name: this.state.name,
            })
          }
        >
          Click Me
        </button>
      </div>
    );
  }
}
