import React, { Component } from 'react';

export default class App extends Component {
  constructor() {
    super();
    this.state = { name: 'bob' };
  }
  componentDidMount() {
    return 'hi';
  }

  render() {
    return <div>hi</div>;
  }
}
