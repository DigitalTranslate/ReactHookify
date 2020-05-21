import React, { Component } from 'react';
class App extends Component {
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
    this.genericMethod();
  }

  genericMethod() {
    const x = 1 + 2;
  }

  genericMethodT = () => {
    const dullVariable = 24;
    this.setState({
      lastName: 'wowow',
    });
  };
  render() {
    return <div></div>;
  }
}
