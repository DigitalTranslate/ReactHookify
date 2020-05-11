import React from 'react';

class Counter extends React.Component {
  constructor() {
    super();
    this.state = {
      counter: 0,
      counter2: 10,
      bool: false,
    };
    this.handleIncrement = this.handleIncrement.bind(this);
  }

  componentDidMount() {
    document.title = this.state.counter;
    this.setState({
      counter2: this.state.counter2 + 1,
    });
  }

  componentDidUpdate() {
    if (this.state.bool === true) {
      this.setState({
        counter: this.state.counter + 10,
      });
    }
    document.title = this.state.counter;
  }

  componentDidUnMount() {}

  handleClick(value) {
    this.setState({
      bool: value,
    });
  }

  render() {
    return (
      <div>
        <div>{this.state.counter}</div>
        <hr />
        <button
          type="button"
          onClick={limit ? this.handleClick(false) : this.handleClick(true)}
        >
          +
        </button>
      </div>
    );
  }
}
