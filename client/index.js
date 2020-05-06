import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
// console.log(App.prototype);
// console.log(App.prototype.render);

class Test {
  constructor() {
    this.state = {
      name: '',
    };
  }
  render() {
    return 'hi';
  }
}
console.log(Test);
console.log(Test.prototype);

ReactDOM.render(<App />, document.getElementById('app'));
