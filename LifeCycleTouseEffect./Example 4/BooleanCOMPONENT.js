import React from 'react';

class Counter extends React.Component {
  constructor() {
    super();
    this.state = {
      counter: 0,
      bool: false,
    };
    this.handleIncrement = this.handleIncrement.bind(this);
  }

  componentDidMount() {
    document.title = this.state.counter;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.counter > 10) {
      this.setState({
        bool: true,
      });
    }
  }

  handleIncrement() {
    this.setState({
      counter: (this.state.counter += 1),
    });
  }

  render() {
    return (
      <div>
        <div>{this.state.counter}</div>
        <hr />
        <button type="button" onClick={this.handleIncrement}>
          +
        </button>
      </div>
    );
  }
}
